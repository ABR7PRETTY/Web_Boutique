import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categorie } from '../models/categorie';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  private apiUrl = 'http://localhost:8080/categorie/'; // ✅ Corrigé

  constructor(private http: HttpClient) { }

  saveCategorie(categorie: Categorie): Observable<any> {
    const formData = new FormData();
    formData.append('libelle', categorie.libelle);
    formData.append('description', categorie.description);
    if (categorie.image) {
      formData.append('image', categorie.image);
    }
    return this.http.post(`${this.apiUrl}save`, formData, { responseType: 'text' });
  }

 deleteCategorie(id:number) {
      return this.http.delete(`${this.apiUrl}delete/${id}`, { responseType: 'text' });
    }

  updateCategorie(id: number, categorie:Categorie) : Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}update/${id}` , categorie);
    }

  findCategorie(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}findById/${id}`);
  }



  getAllCategorie(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}findAll`);
  }
  
}
