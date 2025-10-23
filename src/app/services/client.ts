import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client';
import { ClientProjection } from '../models/client-projection';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'http://localhost:8080/client/'; // ✅ Corrigé

  constructor(private http: HttpClient) { }

  saveClient(client: Client): Observable<any> {
    return this.http.post(`${this.apiUrl}save`, client);
  }

 deleteClient(id:number) {
      return this.http.delete(`${this.apiUrl}delete/${id}`, { responseType: 'text' });
    }

  updateClient(id: number, client:Client) : Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}update/${id}` , client);
    }

  findClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}findById/${id}`);
  }



  getAllClient(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}findAll`);
  }

  getAllClientBySolde(dateStart: string, dateEnd: string): Observable<ClientProjection[]> {
    return this.http.get<ClientProjection[]>(`${this.apiUrl}findAllBySoldeBetween/${dateStart}/${dateEnd}`);
  }

  
}
