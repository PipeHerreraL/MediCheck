import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MedicalService } from '../../services/medical';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-condition-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './condition-search.html',
  styleUrl: './condition-search.css'
})
export class ConditionSearchComponent {
  searchTerm = signal('');
  results = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  hasSearched = signal(false);

  constructor(private medicalService: MedicalService) {}

  onSearch(): void {
    const term = this.searchTerm().trim();
    if (!term) return;

    this.loading.set(true);
    this.error.set(null);
    
    this.medicalService.searchConditions(term)
      .pipe(finalize(() => {
        this.loading.set(false);
        this.hasSearched.set(true);
      }))
      .subscribe({
        next: (response) => {
          console.log('Datos recibidos NIH:', response.data);
          this.results.set(response.data || []);
        },
        error: (err) => {
          console.error('Error en búsqueda NIH:', err);
          this.error.set('No se pudo completar la búsqueda. Por favor intente de nuevo.');
        }
      });
  }
}
