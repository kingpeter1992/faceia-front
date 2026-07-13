export interface QrResponse {
  id: number;
  token: string;
  url: string;
  type: 'COMPTAGE' | 'OFFRANDE' | 'VISITEUR' | string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
  expireAt: string;
  maxUse: number;
  currentUse: number;
  culte: string;
}

export interface CreateQrRequest {
  culteId: string;
  type: string;
  maxUse: number;
  validMinutes: number;
}
