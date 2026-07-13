export interface Intervenant {
  id?: number;
  nom: string;
  motif: string;
  imageAffiche?: File | null;
}

export interface CulteRequest {
  id?: number;
  nom: string;
  sousTitre: string;
  dateDebut: string;
  dateFin: string;
  theme: string;
  sousTheme: string;
  description: string;
  orateur: string;
  moderateur: string;
  intervenants?: Intervenant[]; // 🌟 Ajout ici
}

export interface CulteResponse {
  id: number;
  nom: string;
  sousTitre: string;
  dateDebut: string;
  dateFin: string;
  theme: string;
  sousTheme: string;
  description: string;
  orateur: string;
  moderateur: string;
  affichage1?: string; // 🌟 URL Image Orateur (Reçu du Back)
  affichage2?: string; // 🌟 URL Image Modérateur (Reçu du Back)
  intervenants?: IntervenantReponse[]; // 🌟 Liste des intervenants secondaires
  createdAt: string;
  qrToken?:string
}

export interface IntervenantReponse {
  id?: number;
  nom: string;
  motif: string;
  affichage?: string; // 🌟 URL de la photo de l'intervenant (Reçu du Back)
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export enum CalendarEventType {
  CULTE = 'CULTE',
  PRIERE = 'PRIERE',
  JEUNESSE = 'JEUNESSE',
  CONFERENCE = 'CONFERENCE',
  MARIAGE = 'MARIAGE',
  FUNERAILLES = 'FUNERAILLES',
  REUNION = 'REUNION',
  AUTRE = 'AUTRE'
}

export interface CalendarEventView {
  id: string;
  title: string;
  start: string;
  end: string;

  extendedProps: {
    nom: string;
    sousTitre?: string;
    theme: string;
    sousTheme: string;
    description: string;
    orateur: string;
    moderateur: string;
    affichage1?: string;
    affichage2?: string;
  };
}



type EventType = 'CULTE' | 'PRIERE' | 'ENSEIGNEMENT' | 'JEUNESSE';
export interface GenerateQrResponse {
  token: string;
  url? :string
  expiresAt: string;
  qrCode : string;

}


export interface ValidateQrResponse {

  valid: boolean;

  culteId: number;

  message: string;

  expiresAt: string;

}


export interface GenerateQrRequest {

  culteId: number;

  type:
    | 'COMPTAGE'
    | 'OFFRANDE'
    | 'VISITEUR'
    | 'PRIERE'
    | 'INSCRIPTION';

  expirationMinutes: number;

  maxUses: number;

  note?: string;

}

export interface SubmitComptageRequest {

  token: string;

  hommes: number;

  femmes: number;

  jeunes: number;

  enfants: number;

  visiteurs?: number;

}

export interface PublicComptageRequest {

  hommes: number;

  femmes: number;

  jeunes: number;

  enfants: number;

  visiteurs?: number;

}

export interface ComptageResponse {

  id: number;

  culteId: number;

  hommes: number;

  femmes: number;

  jeunes: number;

  enfants: number;

  visiteurs: number;

  total: number;

  createdAt?: string;

  updatedAt?: string;

}
