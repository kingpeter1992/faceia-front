import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-page',
standalone: true,
  imports: [CommonModule],
  templateUrl: './success-page.html',
  styleUrl: './success-page.css',
})
export class SuccessPage {
  private router = inject(Router);

  // Permet éventuellement de rediriger l'utilisateur ou de réinitialiser l'écran
  fermer() {
    // Si tu veux les renvoyer quelque part, ou simplement les laisser sur une page blanche sécurisée
    alert('Session terminée. Vous pouvez fermer cet onglet en toute sécurité.');
  }
}
