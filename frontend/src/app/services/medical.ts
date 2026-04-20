import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Favorito {
  id: number;
  usuario_id: number;
  categoria_id: number;
  categoria_nombre: string;
  termino_busqueda: string;
  notas_usuario: string | null;
  fecha_creacion: string;
}

export interface FavoritoPayload {
  usuario_id: number;
  categoria_id: number;
  termino_busqueda: string;
  notas_usuario?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicalService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /**
   * Busca condiciones médicas por síntoma o término
   * @param terms Término de búsqueda
   */
  searchConditions(terms: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/conditions/search`, {
      params: { terms }
    });
  }

  /**
   * Obtiene información detallada de una enfermedad por su código ICD-10
   * @param icdCode Código ICD-10
   */
  getConditionInfo(icdCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/conditions/${icdCode}/info`);
  }

  /**
   * Busca reacciones adversas de un medicamento
   * @param terms Nombre del medicamento
   */
  searchDrugs(terms: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/drugs/search`, {
      params: { terms }
    });
  }

  /**
   * Obtiene eventos adversos detallados de la FDA para un medicamento
   * @param drug Nombre del medicamento
   */
  getDrugAdverseEvents(drug: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/drugs/adverse-events`, {
      params: { drug, limit: 5 }
    });
  }

  /**
   * Obtiene los favoritos por usuario
   * @param usuarioId ID del usuario
   */
  getFavoritos(usuarioId: number): Observable<{ data: Favorito[] }> {
    return this.http.get<{ data: Favorito[] }>(`${this.apiUrl}/favoritos`, {
      params: { usuario_id: usuarioId }
    });
  }

  /**
   * Crea un nuevo favorito
   * @param payload Datos del favorito a guardar
   */
  createFavorito(payload: FavoritoPayload): Observable<{ message: string; id: number }> {
    return this.http.post<{ message: string; id: number }>(`${this.apiUrl}/favoritos`, payload);
  }

  /**
   * Actualiza un favorito por id
   * @param id ID del favorito
   * @param payload Campos a actualizar
   */
  updateFavorito(id: number, payload: Partial<Pick<FavoritoPayload, 'termino_busqueda' | 'notas_usuario'>>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/favoritos/${id}`, payload);
  }

  /**
   * Elimina un favorito por id
   * @param id ID del favorito
   */
  deleteFavorito(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/favoritos/${id}`);
  }
}
