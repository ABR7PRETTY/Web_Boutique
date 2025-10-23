import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credit } from '../models/credit';


@Injectable({
  providedIn: 'root'
})
export class CreditService {

  private apiUrl = 'http://localhost:8080/credit/'; // ✅ Corrigé

  constructor(private http: HttpClient) { }

  saveCredit(credit: Credit): Observable<any> {
    return this.http.post(`${this.apiUrl}save`, credit);
  }

  addCreditByArticleId(quantite: number, prix: number , articleId: number, clientId: number): Observable<any> {
    const formData = new FormData();
    formData.append('quantite', quantite.toString());
    formData.append('prix', prix.toString());
    formData.append('clientId', clientId.toString());
    return this.http.post(`${this.apiUrl}saveByArticle/${articleId}`, formData);
  }

 deleteCredit(id:number) {
      return this.http.delete(`${this.apiUrl}delete/${id}`, { responseType: 'text' });
    }

  updateCredit(id: number, credit:Credit) : Observable<Credit> {
    return this.http.put<Credit>(`${this.apiUrl}update/${id}` , credit);
    }


  getAllCredit(articleId: number): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}findAllByArticle/${articleId}`);
  }

    getAllCreditByCategorie(categorieId: number): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}findAllByCategorie/${categorieId}`);
  }

  getAllCreditByDate(dateStart: string, dateEnd: string): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}findByDateBetween/${dateStart}/${dateEnd}`);
  }
  
}
