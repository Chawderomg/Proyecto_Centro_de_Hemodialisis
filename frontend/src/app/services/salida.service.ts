import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalidaService {
  private apiUrl = 'http://localhost:3000/api'; // Ajusta a tu puerto real

  constructor(private http: HttpClient) { }

  // Obtener insumos con sus lotes (para el dashboard y selectores)
  getInsumos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/insumos/dashboard`);
  }

  // Obtener la lista de pacientes
  getPacientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pacientes/getPaciente`);
  }

  // Registrar la salida (Movimiento)
  registrarSalida(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/salidas`, datos);
  }

  // Obtener historial de salidas (Reporte)
  getHistorial(): Observable<any> {
    return this.http.get(`${this.apiUrl}/salidas/historial`);
  }
}