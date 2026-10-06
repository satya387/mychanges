export interface Email {
    id: number; 
    subject: string; 
    body: string; 
    fromEmail: string; 
    ccList?: CcList[]; 
    toList?: ToList[];
    emailReceivedDateTime: Date;
  }
  export interface CcList {
    name: string;
  }
  
  export interface ToList {
    name: string;
  }