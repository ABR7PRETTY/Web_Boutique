import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ravitaillement } from '../models/ravitaillement';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RavitaillementService {

  private apiUrl = 'http://localhost:8080/ravitaillement/'; // ✅ Corrigé

  constructor(private http: HttpClient) { }

  saveRavitaillement(ravitaillement: Ravitaillement): Observable<any> {
    return this.http.post(`${this.apiUrl}save`, ravitaillement);
  }

  addRavitaillementByArticleId(quantite: number,  prix: number , articleId: number): Observable<any> {
    const formData = new FormData();
    formData.append('quantite', quantite.toString());
    formData.append('prix', prix.toString());
    return this.http.post(`${this.apiUrl}ravitailler/${articleId}`, formData);
  }

 deleteRavitaillement(id:number) {
      return this.http.delete(`${this.apiUrl}delete/${id}`, { responseType: 'text' });
    }

  updateRavitaillement(id: number, ravitaillement:Ravitaillement) : Observable<Ravitaillement> {
    return this.http.put<Ravitaillement>(`${this.apiUrl}update/${id}` , ravitaillement);
    }


  getAllRavitaillement(articleId: number): Observable<Ravitaillement[]> {
    return this.http.get<Ravitaillement[]>(`${this.apiUrl}findAllByArticle/${articleId}`);
  }

    getAllRavitaillementByCategorie(categorieId: number): Observable<Ravitaillement[]> {
    return this.http.get<Ravitaillement[]>(`${this.apiUrl}findAllByCategorie/${categorieId}`);
  }

  getAllRavitaillementByDate(dateStart: string, dateEnd: string): Observable<Ravitaillement[]> {
    return this.http.get<Ravitaillement[]>(`${this.apiUrl}findByDateBetween/${dateStart}/${dateEnd}`);
  }
  
}
