
export type ColorPalette = {
    corScreen: string;
    corScreenDisable:string;
    corContainer:string;
    corButton: string;
    corButtonDisable:string,
    corButtonOff:string;
    corText: string;
    corTextSecondary:string,
    corTextLight:string,
    corTextStrong:string,
    transparente:string;
    semiTransparente:string;
    placeholder: string;
    gray:string;
    success:string,
    error:string,
    successDisable:string,
    errorDisable:string,
    border:string,
    blue: string; 
    yellow: string;
    yellowNotice: string;
    white: string;
    black: string;
    red: string;
    pink:string;
    green:string;
    orange:string;
  }; 
  
  export const Colors: ColorPalette = {
    corScreen: '#111827',
    corScreenDisable:'rgba(17, 24, 39, 0.5)',
  
    corContainer:"#efefef",
    
    corButton: '#FF7A00',
    corButtonDisable: '#FFF7ED',
    corButtonOff:'#cccccc',
  
    corText: '#262626', 
    corTextSecondary:"rgba(38,38,38,0.7)",
    corTextLight:'#64748B',
    corTextStrong:'#475569',
  
    transparente:"#00000000",
    semiTransparente:"rgba(0,0,0,0.6)",
  
    placeholder: "#94A3B8",
    gray:"#D3D3D3",
    border: '#F1F5F9', 
    
    success: '#28A745',
    successDisable: '#E9F5EA',
    error: '#E74C3C',
    errorDisable: '#FDEDEC',
    
  
    white: '#ffffff',
    black: '#000000',
  
    blue: '#187fce',
    yellow: '#FFC107',
    yellowNotice:"#FFF8E1",
    red: "#F23C3C",
    pink:"rgba(249, 125, 160, 1)",
    green:'#10B981',
    orange:'#E86A00'
  
  } as const; 
  
  export type ColorKey = keyof typeof Colors;