import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MedicalService } from '../../services/medical';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-condition-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './condition-detail.html',
  styleUrl: './condition-detail.css'
})
export class ConditionDetailComponent implements OnInit {
  icdCode = signal<string | null>(null);
  articles = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  favoriteLoading = signal(false);
  favoriteError = signal<string | null>(null);
  favoriteSuccess = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private medicalService: MedicalService
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('icdCode');
    this.icdCode.set(code);
    
    if (code) {
      this.loadDetail(code);
    } else {
      this.error.set('Código de enfermedad no válido.');
      this.loading.set(false);
    }
  }

  loadDetail(code: string): void {
    this.loading.set(true);
    this.medicalService.getConditionInfo(code)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          console.log('Datos detalle MedlinePlus:', response.data);
          this.articles.set(response.data || []);
        },
        error: (err) => {
          console.error('Error al cargar detalles:', err);
          this.error.set('No se pudo cargar la información detallada para esta condición.');
        }
      });
  }

  addDetailToFavorites(): void {
    const icd = this.icdCode();
    if (!icd) {
      this.favoriteError.set('No se pudo identificar la condición para guardar.');
      this.favoriteSuccess.set(null);
      return;
    }

    const firstArticle = this.articles()[0];
    const title = firstArticle?.title ? `${firstArticle.title} (${icd})` : `Condición ${icd}`;

    this.favoriteLoading.set(true);
    this.favoriteError.set(null);
    this.favoriteSuccess.set(null);

    this.medicalService.createFavorito({
      usuario_id: 1,
      categoria_id: 1,
      termino_busqueda: title,
      notas_usuario: `Guardado desde detalle ICD-10 ${icd}.`
    })
      .pipe(finalize(() => this.favoriteLoading.set(false)))
      .subscribe({
        next: () => {
          this.favoriteSuccess.set('Condición guardada en favoritos.');
        },
        error: (err) => {
          console.error('Error al guardar favorito (detalle):', err);
          this.favoriteError.set(err?.error?.error || 'No se pudo guardar en favoritos.');
        }
      });
  }
}
