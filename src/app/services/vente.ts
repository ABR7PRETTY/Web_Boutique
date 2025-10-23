import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vente } from '../models/vente';
import { constantes } from '../constantes';

@Injectable({
  providedIn: 'root'
})
export class VenteService {

  private apiUrl = `${constantes.apiUrl}/vente/`; // ✅ Corrigé

  constructor(private http: HttpClient) { }

  saveVente(vente: Vente): Observable<any> {
    return this.http.post(`${this.apiUrl}save`, vente);
  }

  addVenteByArticleId(quantite: number, prix: number , articleId: number): Observable<any> {
    const formData = new FormData();
    formData.append('quantite', quantite.toString());
    formData.append('prix', prix.toString());
    return this.http.post(`${this.apiUrl}saveByArticle/${articleId}`, formData);
  }

 deleteVente(id:number) {
      return this.http.delete(`${this.apiUrl}delete/${id}`, { responseType: 'text' });
    }

  updateVente(id: number, vente:Vente) : Observable<Vente> {
    return this.http.put<Vente>(`${this.apiUrl}update/${id}` , vente);
    }


  getAllVente(articleId: number): Observable<Vente[]> {
    return this.http.get<Vente[]>(`${this.apiUrl}findAllByArticle/${articleId}`);
  }

    getAllVenteByCategorie(categorieId: number): Observable<Vente[]> {
    return this.http.get<Vente[]>(`${this.apiUrl}findAllByCategorie/${categorieId}`);
  }

  getAllVenteByDate(dateStart: string, dateEnd: string): Observable<Vente[]> {
    return this.http.get<Vente[]>(`${this.apiUrl}findByDateBetween/${dateStart}/${dateEnd}`);
  }
  
}
