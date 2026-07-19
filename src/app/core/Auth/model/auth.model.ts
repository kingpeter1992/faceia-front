import { RoleUser } from "../../../features/admin/model/admin-user.model";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  nom: string;
  prenom: string;
  email: string;
  roles: RoleUser[];
}

export interface UserConnected {


    id:number;

    nom:string;

    prenom:string;

    email:string;

    roles:string[];


    eglise:EgliseInfo;

}



export interface EgliseInfo {


    id:number;

    churchName:string;

    churchLogo:string;

    adresse:string;

    email:string;

    telephone1:string;
    pasteurResposanble? :string,

}
