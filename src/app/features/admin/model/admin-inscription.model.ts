export interface AdminEtudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
    role: string;
  actif: boolean;
}

export interface AdminFormationDisponible {
  id: number;
  titre: string;
  description: string;

  imageUrl?: string;

  formateurNom?: string;

  nombreNiveaux?: number;
  nombreContenus?: number;
  nombreQcm?: number;
  dureeTotaleMinutes?: number;

  noteMoyenne?: number;
  nombreAvis?: number;

  nombreEtudiantsInscrits?: number;

  dejaInscrit?: boolean;
}

export interface InscriptionFormationRequest {
  etudiantId: number;
  formationId: number;
}


