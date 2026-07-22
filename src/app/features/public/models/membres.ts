export interface MemberTracking {
  qrToken:string;
  churchId?:number;
  culteId?:number;
  evenementId?:number;
  deviceType:
  'MOBILE'
  |
  'TABLET'
  |
  'DESKTOP';
  browserLanguage:string;
  userAgent:string;
  registrationDate:string;
}


export interface MemberRegistrationRequest {
  nom:string;
  prenom:string;
  telephone:string;
  email?:string;
  dateNaissance?:string;
  adresse?:string;
  invite?:string;
  eglise?:string;
  departement?:string;
  source?:string;
  accueil?:number;
  avis?:string;
  tracking:MemberTracking;
}
