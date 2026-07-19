import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChurchSessionStore } from './features/public/egliseInfos/services/church-session.store';
import { ChurchService } from './features/public/egliseInfos/services/ChurchService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {


constructor(
 private churchStore: ChurchSessionStore,
){
  this.churchStore.loadUser()
}



ngOnInit(){

}





}
