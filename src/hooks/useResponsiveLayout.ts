import { useWindowDimensions, Platform } from 'react-native';

export const useResponsiveLayout = () => {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  
  // Breakpoints padrão de mercado
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  return { 
    isWeb, 
    isMobile, 
    isTablet, 
    isDesktop, 
    width, 
    height 
  };
};