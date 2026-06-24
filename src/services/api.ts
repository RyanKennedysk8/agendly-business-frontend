import axios, { AxiosError, AxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

// Constantes
export const STORAGE_AUTH_TOKEN = "Agendly_business_access_token";
export const STORAGE_REFRESH_TOKEN = "Agendly_business_refresh_token";

// Configuração da API 
const api = axios.create({
  baseURL: "http://192.168.18.3:8080/api/v1", 
  timeout: 20000, 
}); 
 
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

api.interceptors.request.use(async (config) => {
  // Evita enviar o header antigo se for uma requisição de refresh manual
  if (config.url?.includes('/auth/refresh')) {
    return config;
  }

  const token = await SecureStore.getItemAsync(STORAGE_AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (!error.response) {
      // Erro de rede (sem internet, servidor off) - Não desloga, apenas rejeita
      return Promise.reject(error);
    }

    // Captura 401 (Não Autorizado) E 403 (Proibido) ---
    // A maioria dos filtros JWT retorna 401 quando o token expira.
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      
      // Se o erro veio da própria rota de refresh, não adianta tentar de novo -> Logout
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Se já tem alguém renovando, entra na fila e aguarda
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync(STORAGE_REFRESH_TOKEN);

        if (!refreshToken) throw new Error("No refresh token stored");

        // Chama o endpoint de renovação
        const { data } = await api.post("/auth/refresh", { refreshToken });
        const { accessToken } = data;

        // Salva o novo token
        await SecureStore.setItemAsync(STORAGE_AUTH_TOKEN, accessToken);
        
        // Configura o axios para as próximas chamadas
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        
        // Processa a fila de requisições que estavam esperando
        processQueue(null, accessToken);
        
        // Reenvia a requisição original que falhou
        if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return api(originalRequest);

      } catch (refreshError) {
        // Se o refresh falhar (ex: refresh token expirou ou foi revogado no banco)
        processQueue(refreshError, null);
        
        // Limpa tudo e força logout
        await SecureStore.deleteItemAsync(STORAGE_AUTH_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_REFRESH_TOKEN);
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;