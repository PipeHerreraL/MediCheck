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
}
