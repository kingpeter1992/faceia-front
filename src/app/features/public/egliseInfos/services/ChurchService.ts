import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../env';
import { Church } from '../models/ChurchModel';



@Injectable({
  providedIn: 'root'
})
export class ChurchService {


  private http = inject(HttpClient);



  // URL Backend

 private API_URL = environment.BASIC_URL + 'churches';


  /**
   * Charger l'église courante
   * Utilisée au démarrage de la session
   */
  getCurrentChurch(): Observable<Church> {


    return this.http.get<Church>(
      `${this.API_URL}/current`
    );


  }






  /**
   * Charger une église par son ID
   */
  getChurchById(id:number): Observable<Church>{


    return this.http.get<Church>(
      `${this.API_URL}/${id}`
    );


  }






  /**
   * Liste des églises
   * utile pour ADMIN
   */
  getAllChurches():Observable<Church[]>{


    return this.http.get<Church[]>(
      this.API_URL
    );


  }





  /**
   * Création église
   */
  createChurch(church:Church):Observable<Church>{


    return this.http.post<Church>(
      this.API_URL,
      church
    );


  }






  /**
   * Mise à jour église
   */
  updateChurch(
      id:number,
      church:Church
  ):Observable<Church>{


    return this.http.put<Church>(
      `${this.API_URL}/${id}`,
      church
    );


  }






  /**
   * Suppression
   */
  deleteChurch(id:number):Observable<void>{


    return this.http.delete<void>(
      `${this.API_URL}/${id}`
    );


  }



}
