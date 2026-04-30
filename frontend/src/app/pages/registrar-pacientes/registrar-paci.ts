import { Component } from '@angular/core';
import { signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, FormsModule, Validators } from '@angular/forms'; 
import { PacienteService } from '../../services/paciente.service';

@Component({
  selector: 'app-create-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './registrar-paci.html',
  styleUrl: './registrar-paci.css',
})

  
export class CreatePaciente implements OnInit {

  constructor(private pacienteService: PacienteService) {}

  // 🔥 SIGNALS
  pacientes = signal<any[]>([]);
  busqueda = signal('');
  mostrarModal = signal(false);
  modoEdicion = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  idEditando = signal<number | null>(null);

  // 🔥 FORM
  paciForm = new FormGroup({
    nombre_completo: new FormControl('', [Validators.required]),
    ci: new FormControl('', [Validators.required]),
    es_activo: new FormControl(true),
  });

  // 🔥 INIT
  ngOnInit() {
    this.cargarPacientes();
  }

  cargarPacientes() {
    this.pacienteService.getPacientes().subscribe({
      next: (res: any) => {
        this.pacientes.set(res.data);
      }
    });
  }

  // 🔍 FILTRO
pacientesFiltrados = computed(() => {
  const texto = this.busqueda().toLowerCase();

  return this.pacientes().filter(p => {
    const nombre = p.nombre_completo?.toLowerCase() || '';
    const ci = p.ci || '';
    

    return nombre.includes(texto) || ci.includes(texto) 
    });
  });

  abrirModal() {
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  editarPaciente(paciente: any) {
    this.modoEdicion.set(true);
    this.idEditando.set(paciente.id_paciente);

    this.paciForm.patchValue({
      nombre_completo: paciente.nombre_completo,
      ci: paciente.ci,
      es_activo: paciente.es_activo,
    });

    this.abrirModal();
  }

  eliminarPaciente(id: number) {
    if (!confirm('¿Eliminar paciente?')) return;

    this.pacienteService.eliminarPaciente(id).subscribe({
      next: () => this.cargarPacientes()
    });
  }

  onSubmit() {
    if (this.paciForm.invalid) return;

    if (this.modoEdicion()) {
      this.pacienteService.actualizarPaciente(this.idEditando(), this.paciForm.value).subscribe({
        next: () => {
          alert('Paciente actualizado');
          this.resetForm();
        }
      });
    } else {
      this.pacienteService.registrar(this.paciForm.value).subscribe({
        next: () => {
          alert('Paciente creado');
          this.resetForm();
        }
      });
    }
  }

  resetForm() {
    this.paciForm.reset();

    this.modoEdicion.set(false);
    this.idEditando.set(null);

    this.cerrarModal();
    this.cargarPacientes();
  }

}