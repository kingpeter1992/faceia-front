export enum QRType {

  COMPTAGE = 'COMPTAGE',

  INSCRIPTION = 'INSCRIPTION',

  EVENEMENT = 'EVENEMENT',

  OFFRANDE = 'OFFRANDE',

  VISITEUR = 'VISITEUR',

  PRIERE = 'PRIERE',

  SAINTE_CENE = 'SAINTE_CENE',

  AUTRE = 'AUTRE'

}

export type QRStatus =
  | 'ACTIVE'
  | 'USED'
  | 'EXPIRED'
  | 'REVOKED';


export interface QrAccess {

  id:number;

  token:string;

  url:string;

  qrCode:string;

  type:string;

  status:string;

  active:boolean;

  expiresAt:string;

  usedCount:number;

  maxUses:number;

  note:string;

}


export interface QrStats {

  actifs:number;

  utilises:number;

  expires:number;

  revoques:number;

  total:number;

}
export interface GenerateQrRequest {
  culteId?: number;
  type:QRType;
  expirationMinutes?: number;
  id?:number;
  token?:string;
  url?:string;
  qrCode?:string;
  status?:string;
  active?:boolean;
  expiresAt?:string;
  usedCount?:number;
  maxUses?:number;
  note?:string;
}
