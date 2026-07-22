import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ConfirmDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {


constructor(
){
}



ngOnInit(){

}





}
