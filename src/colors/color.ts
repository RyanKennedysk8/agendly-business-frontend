
export type ColorPalette = {
    corScreen: string;
    corScreenDisable:string;
    corContainer:string;
    corBoxSearch:string;
    corButtonSearch:string;
    corButton: string;
    corButtonDisable:string,
    corButtonOff:string;
    corButtonRGB:string;
    corText: string;
    corTextSecondary:string,
    corTextLight:string,
    corTextStrong:string,
    corTextSearch:string,
    transparente:string;
    semiTransparente:string; 
    placeholder: string;
    gray:string;
    success:string,
    error:string,
    successDisable:string,
    errorDisable:string,
    border:string,
    borderHairLine:string;
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
    corBoxSearch:"#F8F8F8",
    corButtonSearch:"#E3E3E3",

    corButton: '#FF7A00', 
    corButtonDisable: "rgba(255, 122, 0, 0.3)",
    corButtonOff:'#cccccc',
    corButtonRGB:"rgba(255, 122, 0, 1)",
  
    corText: '#262626',              
    corTextSecondary: 'rgba(38,38,38,0.6)', 
    corTextLight: '#737373',            
    corTextStrong: '#1C1C1E',            
    corTextSearch: '#8A8A8A',           
  
    transparente:"#00000000",
    semiTransparente:"rgba(0,0,0,0.6)",

  
    placeholder: '#8A8A8A',
    gray:"#D3D3D3",
    border: '#F1F5F9', 
    borderHairLine:'#E5E5E5',
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
    pink:"#ff1d8d",
    green:'#10B981',
    orange:'#E86A00'
  
  } as const; 
  
  export type ColorKey = keyof typeof Colors;