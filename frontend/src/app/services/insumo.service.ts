import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InsumoService {

  private API = 'http://localhost:3000/api/insumos';
  private APILOTE = 'http://localhost:3000/api/lotes';

  constructor(private http: HttpClient) {}

  crearInsumo(datos: any): Observable<any> {
    return this.http.post(`${this.API}/`, datos);
  }

  getInsumos(): Observable<any> {
    return this.http.get(`${this.API}/getinsumos`);
  }

  actualizarInsumo(id: number | null, datos: any): Observable<any> {
    return this.http.put(`${this.API}/${id}`, datos);
  }

  eliminarInsumo(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }

  getInsumosDashboard(): Observable<any> {
    return this.http.get(`${this.API}/dashboard`);
  }

  getAlertasVencimiento(): Observable<any> {
    return this.http.get(`${this.API}/vencimientos`);
  }

  getBajoStock(): Observable<any> {
    return this.http.get(`${this.API}/bajo-stock`);
    
  }

  crearLote(datos: any): Observable<any> {
  return this.http.post(`${this.APILOTE}/Lotes`, datos);
}
}