
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
    corTextInfo:string,
    corTextTitle:string,
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

    corButton: '#008B8B', 
    corButtonDisable: "rgba(0,139,139, 0.3)",
    corButtonOff: "rgba(0,139,139, 0.1)",
    corButtonRGB:"rgba(0,139,139, 1)",
  
    corText: '#262626',              
    corTextSecondary: '#525252', 
    corTextLight: '#737373',            
    corTextStrong: '#1C1C1E',            
    corTextSearch: '#8A8A8A',  
    corTextInfo:'#64748B',   
    corTextTitle:'#374151',      
  
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

  export enum AppointmentStatus {
    PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
    CONFIRMED = 'CONFIRMED',
    AWAITING_COMPLETION = 'AWAITING_COMPLETION',
    CANCELLED_BY_CLIENT = 'CANCELLED_BY_CLIENT',
    CANCELLED_BY_COMPANY = 'CANCELLED_BY_COMPANY',
    COMPLETED = 'COMPLETED',
    NO_SHOW = 'NO_SHOW',
  }
   
   export const StatusTheme: Record<
   AppointmentStatus,
   { bg: string; text: string; border: string }
 > = {
   [AppointmentStatus.PENDING_CONFIRMATION]: {
     bg: '#FEF08A',
     text: '#713F12',
     border: '#FDE047',
   },
 
   [AppointmentStatus.CONFIRMED]: {
     bg: '#E0F2FE',
     text: '#075985',
     border: '#BAE6FD',
   },
 
   [AppointmentStatus.AWAITING_COMPLETION]: {
     bg: '#F3E8FF',
     text: '#6B21A8',
     border: '#D8B4FE',
   },
 
   [AppointmentStatus.COMPLETED]: {
     bg: '#DCFCE7',
     text: '#166534',
     border: '#BBF7D0',
   },
 
   [AppointmentStatus.CANCELLED_BY_CLIENT]: {
     bg: '#F1F5F9',
     text: '#475569',
     border: '#E2E8F0',
   },
 
   [AppointmentStatus.CANCELLED_BY_COMPANY]: {
     bg: '#FEE2E2',
     text: '#991B1B',
     border: '#FECACA',
   },
 
   [AppointmentStatus.NO_SHOW]: {
     bg: '#FECACA',
     text: '#7F1D1D',
     border: '#FCA5A5',
   },
 };
  
  export type ColorKey = keyof typeof Colors;