import { Redirect } from 'expo-router';

export default function InitialRoute() {
  // Inicialmente redireciona para a área principal para testes de UI.
  // Posteriormente, isso será gerenciado pelo _layout.tsx raiz verificando auth.
  return <Redirect href="./(main)/(tabs)" />;
}