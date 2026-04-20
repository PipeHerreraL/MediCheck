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
  favoriteLoading = signal(false);
  favoriteError = signal<string | null>(null);
  favoriteSuccess = signal<string | null>(null);

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

  addTermToFavorites(): void {
    const term = this.searchTerm().trim();
    if (!term) {
      this.favoriteError.set('Ingresa un síntoma antes de guardarlo en favoritos.');
      this.favoriteSuccess.set(null);
      return;
    }

    this.saveFavorite(term, 'Guardado desde la búsqueda de síntomas.');
  }

  addConditionToFavorites(condition: any): void {
    const conditionName = condition?.name?.trim();
    if (!conditionName) {
      this.favoriteError.set('No se pudo guardar este resultado en favoritos.');
      this.favoriteSuccess.set(null);
      return;
    }

    const note = condition?.icd10Code
      ? `Resultado relacionado al código ICD-10 ${condition.icd10Code}.`
      : 'Resultado guardado desde lista de síntomas.';

    this.saveFavorite(conditionName, note);
  }

  private saveFavorite(termino: string, notas: string): void {
    this.favoriteLoading.set(true);
    this.favoriteError.set(null);
    this.favoriteSuccess.set(null);

    this.medicalService.createFavorito({
      usuario_id: 1,
      categoria_id: 2,
      termino_busqueda: termino,
      notas_usuario: notas
    })
      .pipe(finalize(() => this.favoriteLoading.set(false)))
      .subscribe({
        next: () => {
          this.favoriteSuccess.set(`"${termino}" se guardó en favoritos.`);
        },
        error: (err) => {
          console.error('Error al guardar favorito (síntomas):', err);
          this.favoriteError.set(err?.error?.error || 'No se pudo guardar en favoritos.');
        }
      });
  }
}
