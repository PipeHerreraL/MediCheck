import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
