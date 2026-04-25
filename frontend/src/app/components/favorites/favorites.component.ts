import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Favorito, FavoritoPayload, MedicalService } from '../../services/medical';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class FavoritesComponent implements OnInit {
  private readonly usuarioId = 1;

  readonly categorias = [
    { id: 1, nombre: 'Condición Médica' },
    { id: 2, nombre: 'Síntoma' },
    { id: 3, nombre: 'Búsqueda General' }
  ];

  favoritos = signal<Favorito[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  hasLoaded = signal(false);

  createCategoriaId = signal(2);
  createTermino = signal('');
  createNotas = signal('');
  creating = signal(false);

  editingId = signal<number | null>(null);
  editTermino = signal('');
  editNotas = signal('');
  savingId = signal<number | null>(null);
  deletingId = signal<number | null>(null);

  constructor(private medicalService: MedicalService) {}

  ngOnInit(): void {
    this.loadFavoritos();
  }

  loadFavoritos(): void {
    this.loading.set(true);
    this.error.set(null);

    this.medicalService.getFavoritos(this.usuarioId)
      .pipe(finalize(() => {
        this.loading.set(false);
        this.hasLoaded.set(true);
      }))
      .subscribe({
        next: (response) => {
          this.favoritos.set(response.data || []);
        },
        error: (err) => {
          console.error('Error al cargar favoritos:', err);
          this.error.set(err?.error?.error || 'No se pudieron cargar tus favoritos.');
        }
      });
  }

  createFavorito(): void {
    const termino = this.createTermino().trim();
    if (!termino) {
      this.error.set('El término de búsqueda es obligatorio para crear un favorito.');
      return;
    }

    this.creating.set(true);
    this.error.set(null);
    this.success.set(null);

    const payload: FavoritoPayload = {
      usuario_id: this.usuarioId,
      categoria_id: this.createCategoriaId(),
      termino_busqueda: termino,
      notas_usuario: this.createNotas().trim() || undefined
    };

    this.medicalService.createFavorito(payload)
      .pipe(finalize(() => this.creating.set(false)))
      .subscribe({
        next: () => {
          this.createTermino.set('');
          this.createNotas.set('');
          this.success.set('Favorito creado exitosamente.');
          this.loadFavoritos();
        },
        error: (err) => {
          console.error('Error al crear favorito:', err);
          this.error.set(err?.error?.error || 'No se pudo crear el favorito.');
        }
      });
  }

  startEdit(favorito: Favorito): void {
    this.editingId.set(favorito.id);
    this.editTermino.set(favorito.termino_busqueda);
    this.editNotas.set(favorito.notas_usuario || '');
    this.error.set(null);
    this.success.set(null);
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editTermino.set('');
    this.editNotas.set('');
  }

  saveEdit(favoritoId: number): void {
    const termino = this.editTermino().trim();
    if (!termino) {
      this.error.set('El término de búsqueda no puede quedar vacío.');
      return;
    }

    this.savingId.set(favoritoId);
    this.error.set(null);
    this.success.set(null);

    this.medicalService.updateFavorito(favoritoId, {
      termino_busqueda: termino,
      notas_usuario: this.editNotas().trim()
    })
      .pipe(finalize(() => this.savingId.set(null)))
      .subscribe({
        next: () => {
          this.success.set('Favorito actualizado.');
          this.cancelEdit();
          this.loadFavoritos();
        },
        error: (err) => {
          console.error('Error al actualizar favorito:', err);
          this.error.set(err?.error?.error || 'No se pudo actualizar el favorito.');
        }
      });
  }

  deleteFavorito(favoritoId: number): void {
    const confirmDelete = window.confirm('¿Seguro que deseas eliminar este favorito?');
    if (!confirmDelete) {
      return;
    }

    this.deletingId.set(favoritoId);
    this.error.set(null);
    this.success.set(null);

    this.medicalService.deleteFavorito(favoritoId)
      .pipe(finalize(() => this.deletingId.set(null)))
      .subscribe({
        next: () => {
          this.success.set('Favorito eliminado.');
          this.loadFavoritos();
        },
        error: (err) => {
          console.error('Error al eliminar favorito:', err);
          this.error.set(err?.error?.error || 'No se pudo eliminar el favorito.');
        }
      });
  }
}
