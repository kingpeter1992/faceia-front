export interface Membre {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  invite?: string;
  eglise?: string;
  accueil?: string;
  avis?: string;
  createdAt?: string;
  // ✅ Correspondance exacte avec l'entité Spring Boot
  culte?: { id: number } | null;
}
