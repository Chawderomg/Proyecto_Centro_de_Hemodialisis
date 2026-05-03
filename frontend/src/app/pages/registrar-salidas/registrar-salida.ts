
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

   historial: any[] = [];
  cargando = true;
  
  // Objeto que se enviará al backend
  nuevaSalida = {
  id_paciente: null,
  id_insumo: null, 
  id_lote: null,
  id_usuario: 1,
  cantidad: 0

  
};

  constructor(
    private salidaService: SalidaService, 
    private cdr: ChangeDetectorRef // 2. Inyectar  // Agregado
  ) { }
  ngOnInit() {
    this.cargarDatos();
    this.cargarHistorial();
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
    const hoy = new Date(); // Obtenemos la fecha actual

    // 1. FILTRADO DOBLE: Stock disponible Y que NO esté vencido
    const lotesValidos = insumo.detalles_lotes.filter((l: any) => {
      const fechaVencimiento = new Date(l.fecha_vencimiento);
      return l.cantidad_disponible > 0 && fechaVencimiento > hoy;
    });
    
    // 2. ORDENADO: El que vence más pronto (pero que sigue vigente) arriba
    this.lotesFiltrados = lotesValidos.sort((a: any, b: any) => {
      const fechaA = new Date(a.fecha_vencimiento).getTime();
      const fechaB = new Date(b.fecha_vencimiento).getTime();
      return fechaA - fechaB;
    });

  } else {
    this.lotesFiltrados = [];
  }
  
  this.cdr.detectChanges();
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

  guardar() {
    this.salidaService.registrarSalida(this.nuevaSalida).subscribe({
      next: (res) => {
        alert("Salida registrada. El stock se actualizó automáticamente.");
        // Aquí podrías resetear el formulario o redirigir al historial
        this.cargarDatos();
        this.resetForm();
      },
      error: (err) => alert("Error: " + err.error.message)
    });
    
  }

   resetForm() {
  this.nuevaSalida = {
    id_paciente: null,
    id_insumo: null,
    id_lote: null,
    id_usuario: 1,
    cantidad: 0
  };

  this.lotesFiltrados = [];
  this.stockMaximo = 0;
  this.errorStock = false;
  this.cdr.detectChanges(); // Forzamos a que la interfaz se limpie visualmente
}

  cargarHistorial() {
    this.salidaService.getHistorial().subscribe({
      next: (res: any) => {
        console.log("HISTORIAL:", res);
        this.historial = res.data || res;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  // 🔍 FILTROS
busqueda = '';
filtroPaciente = '';
filtroFecha = '';

// 🔥 COMPUTED (tabla filtrada)
get historialFiltrado() {
  return this.historial.filter(item => {

    const coincideTexto =
      item.insumo?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      item.lote?.toLowerCase().includes(this.busqueda.toLowerCase());

    const coincidePaciente =
      !this.filtroPaciente ||
      item.paciente === this.filtroPaciente;

    const coincideFecha =
      !this.filtroFecha ||
      item.fecha_salida?.startsWith(this.filtroFecha);

    return coincideTexto && coincidePaciente && coincideFecha;
  });
}


// 🔥 CONTROL MODAL
mostrarModal = false;

abrirModal() {
  this.mostrarModal = true;
}

cerrarModal() {
  this.mostrarModal = false;
}

}