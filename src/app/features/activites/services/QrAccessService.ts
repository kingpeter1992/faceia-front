import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../env";
import { GenerateQrResponse, ValidateQrResponse,  SubmitComptageRequest, GenerateQrRequest, PublicComptageRequest, ComptageResponse } from "../models/culte.model";
import { Observable } from "rxjs";
import { QrAccess } from "../../Qrcode/models/QrModule";

@Injectable({
    providedIn:'root'
})
export class QrAccessService{


  private api = environment.BASIC_URL + 'qr-access';
  private comptageApi = environment.BASIC_URL + 'comptages';

  constructor(private http: HttpClient) {}

  /**
   * Générer un QR
   */
generate(culteId: number): Observable<GenerateQrResponse> {
  const request: GenerateQrRequest = {
    culteId,
    type: 'COMPTAGE',
    expirationMinutes: 60,
    maxUses: 1,
    note: 'Accès protocole comptage'
  };

  return this.http.post<GenerateQrResponse>(
    `${this.api}/generate`,
    request
  );

}

getAll():Observable<QrAccess[]>{

 return this.http.get<QrAccess[]>(
   this.api
 );

}

  /**
   * Validation du QR
   */
  validate(token: string): Observable<ValidateQrResponse> {

    return this.http.get<ValidateQrResponse>(
      `${this.api}/validate/${token}`
    );

  }

  /**
   * Soumission publique du protocole
   */
  submit(
    token: string,
    request: PublicComptageRequest
  ): Observable<any> {

    const body: SubmitComptageRequest = {

      token,

      hommes: request.hommes,

      femmes: request.femmes,

      jeunes: request.jeunes,

      enfants: request.enfants,

      visiteurs: request.visiteurs ?? 0

    };

    return this.http.post(
      `${this.api}/submit`,
      body
    );

  }

  /**
   * Sauvegarde depuis l'administration
   */
  saveInternalComptage(
    culteId: number,
    payload: any
  ): Observable<ComptageResponse> {

    return this.http.post<ComptageResponse>(
      `${this.comptageApi}/save`,
      {
        ...payload,
        culteId
      }
    );

  }

  /**
   * Charger le comptage d'un culte
   */
  getComptageByCulte(
    culteId: number
  ): Observable<ComptageResponse> {

    return this.http.get<ComptageResponse>(
      `${this.comptageApi}/culte/${culteId}`
    );

  }

  /**
   * Révoquer un QR
   */
  revoke(token: string): Observable<void> {

    return this.http.delete<void>(
      `${this.api}/${token}`
    );

  }

}
