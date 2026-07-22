import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../env";
import { GenerateQrRequest, QrAccess } from "../models/QrModule";
import { GenerateQrResponse, ValidateQrResponse } from "../../activites/models/culte.model";
import { PublicQrInfo } from "../models/PublicQrInfo";

@Injectable({
 providedIn:'root'
})
export class QrManagementService {


private readonly api = environment.BASIC_URL + 'qr-access';

  constructor(private http: HttpClient) {}

  getAll(): Observable<QrAccess[]> {
    return this.http.get<QrAccess[]>(this.api);
  }

  generate(request: GenerateQrRequest): Observable<GenerateQrResponse> {
      console.log('form', request)
    return this.http.post<GenerateQrResponse>(
      `${this.api}/generate`,
      request
    );
  }

  revoke(token: string): Observable<void> {
    return this.http.delete<void>(
      `${this.api}/${token}`
    );
  }

   delete(token: string) {
    return this.http.delete<void>(
      `${this.api}/${token}`
    );
  }

  regenerate(token: string): Observable<GenerateQrResponse> {
    return this.http.post<GenerateQrResponse>(
      `${this.api}/regenerate/${token}`,
      {}
    );
  }


  validateToken(token:string){
 return this.http.get<ValidateQrResponse>(
 `${this.api}/validate/${token}`

 );


}


}
