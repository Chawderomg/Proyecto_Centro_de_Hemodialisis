import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminDashboard {

  isCollapsed = false;
  titulo = 'Panel Administrativo';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;

      if (url.includes('registrar-usuario')) {
        this.titulo = 'Gestión de Usuarios';
      } else if (url.includes('registrar-cat')) {
        this.titulo = 'Registro de Insumos';
      } else if (url.includes('lotes')) {
        this.titulo = 'Gestión de Lotes';
      } else {
        this.titulo = 'Panel Administrativo';
      }
    });

    /*
          const rutas: any = {
        'registrar-usuario': 'Gestión de Usuarios',
        'registrar-cat': 'Registro de Insumos',
        'panel-lotes': 'Gestión de Lotes'
      };

      this.router.events.subscribe(() => {
        const url = this.router.url;

        this.titulo = Object.keys(rutas).find(r => url.includes(r))
          ? rutas[Object.keys(rutas).find(r => url.includes(r))!]
          : 'Panel Administrativo';
      });
      }
     */
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}