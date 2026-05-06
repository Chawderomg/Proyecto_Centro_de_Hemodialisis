import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalidaService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { }

  
  getInsumos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/insumos/dashboard`);
  }


  getPacientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pacientes/getPaciente`);
  }


  registrarSalida(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/salidas`, datos);
  }

  
  getHistorial(): Observable<any> {
    return this.http.get(`${this.apiUrl}/salidas/historial`);
  }
}