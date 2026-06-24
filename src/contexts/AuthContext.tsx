import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api, { STORAGE_AUTH_TOKEN, STORAGE_REFRESH_TOKEN } from '@services/api';
import { User } from '@type/user';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';

interface AuthContextData {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    signInWithToken: (accessToken: string, refreshToken: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        let isMounted = true;

        const loadUser = async () => {
            try {
                const access = await SecureStore.getItemAsync(STORAGE_AUTH_TOKEN);
                const refresh = await SecureStore.getItemAsync(STORAGE_REFRESH_TOKEN);

                if (access && refresh) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                    
                    try {
                        // Tenta validar o token buscando dados do usuário
                        const { data } = await api.get<User>('/users/me');
                        
                        if (isMounted) {
                            setUser(data);
                            setToken(access);
                        }
                    } catch (apiError: any) {
                        const status = apiError.response?.status;
                        
                        // Só desloga se o servidor responder que o token é inválido/expirado
                        // e o refresh (tentado pelo interceptor) também falhou.
                        if (status === 401 || status === 403) {
                            console.error("Token rejeitado pelo servidor. Deslogando.");
                            await performSignOut();
                        } else {
                            // Se for erro de rede (servidor off, sem internet), 
                            // MANTÉM o token na memória e deixa o usuário "logado offline"
                            // ou tenta de novo depois. Não apague os dados!
                            console.warn("Erro de conexão ao validar usuário. Mantendo sessão local.");
                            if (isMounted) {
                                setToken(access);
                             
                            }
                        }
                    }
                }
            } catch (error) {
                console.log("Erro crítico no storage:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadUser();
        
        return () => { isMounted = false; };
    }, []);

    const performSignOut = async () => {
        await SecureStore.deleteItemAsync(STORAGE_AUTH_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_REFRESH_TOKEN);
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setToken(null);
    };

    const signInWithToken = async (accessToken: string, refreshToken: string) => {
        try {
            await SecureStore.setItemAsync(STORAGE_AUTH_TOKEN, accessToken);
            await SecureStore.setItemAsync(STORAGE_REFRESH_TOKEN, refreshToken);
            
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            setToken(accessToken);
    
            const { data } = await api.get('/users/me');
    
            const roles = data.roles || [];
            if (!roles.includes('ROLE_OWNER') && !roles.includes('ROLE_EMPLOYEE')) {
                await performSignOut(); // Apaga os dados
                throw new Error("Acesso negado. Este aplicativo é exclusivo para parceiros e funcionários.");
            }
    
            setUser(data);
        } catch (error) {
            console.error("Erro ao logar", error);
            await performSignOut();
            throw error;
        }
    };
    const signOut = async () => {
        try {
            const refresh = await SecureStore.getItemAsync(STORAGE_REFRESH_TOKEN);
            if (refresh) await api.post('/auth/logout', { refreshToken: refresh });
        } catch (e) {
            // Ignora erro de rede no logout
        } finally {
            await performSignOut();
        }
    };

    const updateUser = (newData: Partial<User>) => {
        setUser(curr => curr ? { ...curr, ...newData } as User : null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, signInWithToken, signOut, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);