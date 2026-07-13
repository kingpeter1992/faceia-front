export type RoleUser = 'ADMIN' | 'RESPONSABLE_01' | 'RESPONSABLE_02' | 'EN_ATTENTE';

export interface UserResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  roles: RoleUser;
  actif: boolean;
  dateCreation?: string;
}

export interface AssignRoleRequest {
  role: RoleUser;
}


export interface InscriptionDetailResponse {

  etudiant: {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    statut?: 'ACTIF' | 'INACTIF';
  };

  progressionGlobale: number; // 0 - 100

  formationSuggestion?: string; // IA suggestion

  formations: InscriptionDetailItemDto[];
}

export interface InscriptionDetailItem {

  formationId: number;

  formationTitre: string;

  enseignant: string;

  niveauActuel: number; // N1, N2, N3

  progression: number; // 0 - 100

  tempsPasse: number; // minutes

  dateInscription?: string;

  statut: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';

}
export interface InscriptionDetailItemDto {
  formationId: number;
  titre: string;
  formateur: string;
  niveaux: number[];
  progressionMoyenne: number;
}
