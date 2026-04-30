import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // <--- ¡Mantenlo!

@Injectable({ providedIn: 'root' })
export class PacienteService {
  //puerta de el lase con el backend
  private API_URL_REGISTER_PACIENTE = 'http://localhost:3000/api/pacientes/registerPaciente';

  constructor(private http: HttpClient) {}

  registrar(datos: any): Observable<any> {
    return this.http.post(this.API_URL_REGISTER_PACIENTE, datos);
  }

 
  getPacientes(): Observable<any> {
    return this.http.get('http://localhost:3000/api/pacientes/getPaciente');
  }
///:id
  actualizarPaciente(id: number | null, datos: any): Observable<any> {
    return this.http.put(`http://localhost:3000/api/pacientes/${id}`, datos);
  }

  eliminarPaciente(id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/pacientes/${id}`);
  }



}