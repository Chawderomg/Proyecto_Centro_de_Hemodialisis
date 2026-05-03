import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio-principal/inicio';
import { LoginUser } from './pages/login-user/login';
import { AdminDashboard } from './pages/dashboard-admin/admin';
import { CreateUser } from './pages/create-user/create-user';
import { RegistrarCat } from './pages/register-cat/register-cat';
import { PanelLotesComponent } from './pages/panel-lotes/panel-lotes';
import { CreatePaciente } from './pages/registrar-pacientes/registrar-paci';
import { RegistrarSalida } from './pages/registrar-salidas/registrar-salida';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'login', component: LoginUser },
  
  // Dashboard de Administrador
  { 
    path: 'admin', component: AdminDashboard,
    children: [
      { path: 'registrar-usuario', component: CreateUser },
      { path: 'registrar-cat', component: RegistrarCat },
      { path: 'lotes', component: PanelLotesComponent },
      { path: 'registrar-paciente', component: CreatePaciente },
      { path: 'registrar-salida', component: RegistrarSalida  },

      { path: '', redirectTo: 'registrar-usuario', pathMatch: 'full' }
    ]
  },

  // RUTAS PARA ROLES
  { path: 'enfermeria', component: Inicio }, 
  { path: 'almacen', component: Inicio },

  // Comodín
  { path: '**', redirectTo: '' }
];