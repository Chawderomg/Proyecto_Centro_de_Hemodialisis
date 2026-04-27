import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { InsumoService } from '../../services/insumo.service';

@Component({
  selector: 'app-panel-lotes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './panel-lotes.html',
  styleUrls: ['./panel-lotes.css']
})
export class PanelLotesComponent implements OnInit {
  // Datos de las tablas y alertas
  insumos: any[] = [];
  alertasVencimiento: any[] = [];
  alertasBajoStock: any[] = [];

  // Estados de la UI
  mostrarNotificaciones = false;
  mostrarModal = false;
  cargando = true;

  // Formulario para el Lote (Alineado con tu Backend)
  loteForm = new FormGroup({
    id_insumo: new FormControl('', [Validators.required]),
    numero_lote: new FormControl('', [Validators.required]),
    cantidad_inicial: new FormControl('', [Validators.required, Validators.min(1)]),
    fecha_vencimiento: new FormControl('', [Validators.required])
  });

  constructor(
    private insumoService: InsumoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.cargando = true;
    try {
      // Cargamos todas las peticiones en paralelo para mayor velocidad
      const [resInsumos, resVenc, resStock] = await Promise.all([
        firstValueFrom(this.insumoService.getInsumosDashboard()),
        firstValueFrom(this.insumoService.getAlertasVencimiento()),
        firstValueFrom(this.insumoService.getBajoStock())
      ]);

      this.insumos = resInsumos?.data ?? [];
      this.alertasVencimiento = resVenc?.data ?? [];
      this.alertasBajoStock = resStock?.data ?? [];
    } catch (e) {
      console.error("Error al cargar el Dashboard:", e);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges(); // Forzamos el renderizado final
    }
  }

  // Lógica del Modal
  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.loteForm.reset();
  }

  async guardarLote() {
    if (this.loteForm.valid) {
      try {
        const response = await firstValueFrom(this.insumoService.crearLote(this.loteForm.value));
        if (response.success) {
          alert(response.message);
          this.cerrarModal();
          this.cargarDatos(); // Refrescamos todo el dashboard
        }
      } catch (e: any) {
        console.error("Error al registrar lote:", e);
        alert(e.error?.message || "Error al conectar con el servidor");
      }
    }
  }

  // Getters para cálculos rápidos en el HTML
  get totalStock(): number {
    return this.insumos.reduce((acc, i) => acc + (i.stock_total || 0), 0);
  }

  get totalAlertas(): number {
    return this.alertasVencimiento.length + this.alertasBajoStock.length;
  }

  // Helpers de UI
  toggleNotificaciones() {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'Sin fecha';
    const f = new Date(fecha);
    return isNaN(f.getTime()) ? 'Fecha inválida' :
      f.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  verLotes(insumo: any) {
    alert(`Lotes de ${insumo.nombre}\nStock Actual: ${insumo.stock_total}`);
  }
}