import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <footer class="footer">
      <div class="footer-container">
        <p>&copy; 2026 MediCheck - Proyecto Académico Universidad de Manizales</p>
        <p>Los datos médicos son proporcionados por NIH y la FDA para fines informativos.</p>
      </div>
    </footer>
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - 160px);
      background-color: #fcfdfd;
    }
    .footer {
      background: #2c3e50;
      color: white;
      padding: 2rem 0;
      margin-top: 4rem;
      text-align: center;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .footer p {
      margin: 0.5rem 0;
      font-size: 0.9rem;
      opacity: 0.8;
    }
  `]
})
export class AppComponent {}
