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
}
