import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import { InsumoService } from '../../services/insumo.service';

@Component({
  selector: 'app-register-cat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-cat.html',
  styleUrl: './register-cat.css',
})
export class RegistrarCat {

  errorMessage = '';
  successMessage = '';

  constructor(
    private insumoService: InsumoService
  ) {}

  insumoForm = new FormGroup({

    codigo_interno: new FormControl('', [
      Validators.required
    ]),

    nombre: new FormControl('', [
      Validators.required
    ]),

    stock_minimo: new FormControl(0, [
      Validators.required,
      Validators.min(0)
    ])

  });


  onSubmit() {

    if (this.insumoForm.valid) {

      this.insumoService
        .crearInsumo(this.insumoForm.value)
        .subscribe({

          next: (res: any) => {

            this.successMessage =
              res.message ||
              "Insumo registrado correctamente";

            this.errorMessage = '';

            this.insumoForm.reset({
              stock_minimo: 0
            });

          },

          error: (err) => {

            this.errorMessage =
              err.error.message ||
              "Error al registrar insumo";

            this.successMessage = '';

          }

        });

    }

  }

}