import { Injectable, computed, inject, signal } from '@angular/core';
import { Church } from '../models/ChurchModel';
import { AuthService } from '../../../../core/service/auth/auth-service';
import { UserConnected } from '../../../../core/Auth/model/auth.model';


@Injectable({
  providedIn: 'root'
})
export class ChurchSessionStore {

  private authService = inject(AuthService);
  private userSignal = signal<UserConnected|null>(null);
  user = computed(()=>this.userSignal());
  eglise = computed( ()=>this.user()?.eglise ?? null);

  loadUser(){
      this.authService.getCurrentUser()
        .subscribe({
          next:(user)=>{
            this.userSignal.set(user);
            console.log('user et eglise', user)
      }
});


}



  // ======================
  // STATE
  // ======================


  private churchState = signal<Church | null>(null);



  // ======================
  // SELECTORS
  // ======================


  church = computed(() => this.churchState());



  churchName = computed(() =>
    this.churchState()?.name ?? ''
  );



  churchLogo = computed(() =>
    this.churchState()?.logo ?? ''
  );



  churchId = computed(() =>
    this.churchState()?.id ?? null
  );




  // ======================
  // ACTIONS
  // ======================


setChurch(church: Church){


this.churchState.set(church);


sessionStorage.setItem(
 'church',
 JSON.stringify(church)
);


}



  clear(){

    this.churchState.set(null);
    this.userSignal.set(null);

  }



}
