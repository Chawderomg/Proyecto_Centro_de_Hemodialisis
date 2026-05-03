import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoteService {

  private API = 'http://localhost:3000/api/lotes';

  constructor(private http: HttpClient) {}

  getLotes(): Observable<any> {
    return this.http.get(`${this.API}/getLotes`);
  }

  createLote(data: any): Observable<any> {
    return this.http.post(`${this.API}/Lotes`, data);
  }

  getVencimientos(): Observable<any> {
    return this.http.get(`${this.API}/vencimientos`);
  }
}