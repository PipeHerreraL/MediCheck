import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicalService } from '../../services/medical';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-drug-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drug-info.html',
  styleUrl: './drug-info.css'
})
export class DrugInfoComponent {
  drugTerm = signal('');
  reactions = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  hasSearched = signal(false);
  favoriteLoading = signal(false);
  favoriteError = signal<string | null>(null);
  favoriteSuccess = signal<string | null>(null);

  constructor(private medicalService: MedicalService) {}

  onSearch(): void {
    const term = this.drugTerm().trim();
    if (!term) return;

    this.loading.set(true);
    this.error.set(null);

    this.medicalService.searchDrugs(term)
      .pipe(finalize(() => {
        this.loading.set(false);
        this.hasSearched.set(true);
      }))
      .subscribe({
        next: (response) => {
          console.log('Datos recibidos FDA:', response.data);
          this.reactions.set(response.data || []);
        },
        error: (err) => {
          console.error('Error en búsqueda FDA:', err);
          this.error.set('No se pudo obtener información de la FDA para este medicamento.');
        }
      });
  }

  addDrugToFavorites(): void {
    const term = this.drugTerm().trim();
    if (!term) {
      this.favoriteError.set('Ingresa un medicamento antes de guardarlo en favoritos.');
      this.favoriteSuccess.set(null);
      return;
    }

    this.favoriteLoading.set(true);
    this.favoriteError.set(null);
    this.favoriteSuccess.set(null);

    this.medicalService.createFavorito({
      usuario_id: 1,
      categoria_id: 3,
      termino_busqueda: term,
      notas_usuario: 'Guardado desde consulta de medicamentos.'
    })
      .pipe(finalize(() => this.favoriteLoading.set(false)))
      .subscribe({
        next: () => {
          this.favoriteSuccess.set(`"${term}" se guardó en favoritos.`);
        },
        error: (err) => {
          console.error('Error al guardar favorito (medicamentos):', err);
          this.favoriteError.set(err?.error?.error || 'No se pudo guardar en favoritos.');
        }
      });
  }
}
