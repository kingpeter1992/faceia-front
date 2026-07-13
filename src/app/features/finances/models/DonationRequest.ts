export interface DonationRequest {
  culteId: number;
  donateur: string;
  montant: number;
  devise: 'USD' | 'CDF';
  date: string;
  note?: string;
  operation: 'ESPECES' | 'MOBILE_MONEY';
  typeDon: 'DON' | 'DIME' | 'OFFRANDE' | 'CONSTRUCTION' | 'ACTION_GRACE' | 'OFFRANDE_SPECIALE';
}
export interface DonationResponse {
  id: number;
  culteId: number;
  donateur: string;
  culteNom?:string
  montant: number;
  devise: string;
  date: string;
  note: string;
  operation: string;
  typeDon: string;
}
