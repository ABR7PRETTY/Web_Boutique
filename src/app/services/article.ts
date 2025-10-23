import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article';
import { constantes } from '../constantes';
import { Rapport } from '../models/rapport';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiUrl = `${constantes.apiUrl}/article/`; // ✅ Corrigé

  constructor(private http: HttpClient) { }

  saveArticle(article: Article): Observable<any> {
    const formData = new FormData();
    formData.append('libelle', article.libelle);
    formData.append('prix', article.prix.toString());
    formData.append('categorieId', article.categorie.id.toString());
    if (article.image) {
      formData.append('image', article.image);
    }
    return this.http.post(`${this.apiUrl}save`, formData, { responseType: 'text' });
  }

 deleteArticle(id:number) {
      return this.http.delete(`${this.apiUrl}delete/${id}`, { responseType: 'text' });
    }

  updateArticle(id: number, article:Article) : Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}update/${id}` , article);
    }

  findArticle(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}findById/${id}`);
  }


  getAllArticle(categorieId: number): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}findAllByCategorie/${categorieId}`);
  }

  getRapport(dateStart: string, dateEnd: string): Observable<Rapport[]> {
      return this.http.get<Rapport[]>(`${this.apiUrl}findRapport/${dateStart}/${dateEnd}`);
    }
  
}
