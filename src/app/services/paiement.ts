import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paiement } from '../models/paiement';
import { constantes } from '../constantes';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private apiUrl = `${constantes.apiUrl}/paiement/`; // ✅ Corrigé

  constructor(private http: HttpClient) { }

  savePaiement(paiement: Paiement): Observable<any> {
    return this.http.post(`${this.apiUrl}save`, paiement);
  }

  addPaiementByClientId(montant: number, clientId: number): Observable<any> {
    const formData = new FormData();
    formData.append('montant', montant.toString());
    return this.http.post(`${this.apiUrl}saveWithClient/${clientId}`, formData);
  }

 deletePaiement(id:number) {
      return this.http.delete(`${this.apiUrl}delete/${id}`, { responseType: 'text' });
    }

  updatePaiement(id: number, paiement:Paiement) : Observable<Paiement> {
    return this.http.put<Paiement>(`${this.apiUrl}update/${id}` , paiement);
    }


  getAllPaiementByClient(clientId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}findByClient/${clientId}`);
  }

    getAllPaiement(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}findAll`);
  }

  getAllPaiementByDate(dateStart: string, dateEnd: string): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}findByDateBetween/${dateStart}/${dateEnd}`);
  }
  
}
