
import { Component,signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, FormsModule, Validators } from '@angular/forms'; 
import { ChangeDetectorRef } from '@angular/core'; // 1. Importar

import { SalidaService } from '../../services/salida.service';

@Component({
  selector: 'app-registrar-salida',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './registrar-salida.html',
  styleUrl: './registrar-salida.css',
})


export class RegistrarSalida implements OnInit {
  insumos: any[] = [];
  pacientes: any[] = [];
  
  lotesFiltrados: any[] = [];

  stockMaximo: number = 0;
  errorStock: boolean = false;
  
  // Objeto que se enviará al backend
  nuevaSalida = {
  id_paciente: null,
  id_insumo: null, // 🔥 IMPORTANTE
  id_lote: null,
  id_usuario: 1,
  cantidad: 0
};

  constructor(
    private salidaService: SalidaService, private cdr: ChangeDetectorRef // 2. Inyectar  // Agregado
  ) { }
  ngOnInit() {
    this.cargarDatos();
  }

 cargarDatos() {
  this.salidaService.getInsumos().subscribe(res => {
    console.log("INSUMOS:", res);
    this.insumos = res.data ;
    this.cdr.detectChanges(); // 3. Forzar el pintado
    
  });

  this.salidaService.getPacientes().subscribe(res => {
    console.log("PACIENTES:", res);
    this.pacientes = res.data ;
    this.cdr.detectChanges(); // 3. Forzar el pintado
  });
}

  // 🔥 LA TAREA CLAVE: Filtrado dinámico
  onSeleccionarInsumo(idInsumo: any) {
    const insumo = this.insumos.find(i => i.id_insumo == idInsumo);
    if (insumo && insumo.detalles_lotes) {
      // Solo lotes con stock > 0
      this.lotesFiltrados = insumo.detalles_lotes.filter((l: any) => l.cantidad_disponible > 0);
    } else {
      this.lotesFiltrados = [];
    }
  }

  
  guardar() {
    this.salidaService.registrarSalida(this.nuevaSalida).subscribe({
      next: (res) => {
        alert("Salida registrada. El stock se actualizó automáticamente.");
        // Aquí podrías resetear el formulario o redirigir al historial
      },
      error: (err) => alert("Error: " + err.error.message)
    });
  }


    // Modificamos la lógica de selección de lote
  onSeleccionarLote(idLote: any) {
    const lote = this.lotesFiltrados.find(l => l.id_lote == idLote);
    if (lote) {
      this.stockMaximo = lote.cantidad_disponible;
      this.validarCantidad(); // Validamos de inmediato
    }
  }


  validarCantidad() {
    if (this.nuevaSalida.cantidad > this.stockMaximo || this.nuevaSalida.cantidad <= 0) {
      this.errorStock = true;
    } else {
      this.errorStock = false;
    }
  }

}