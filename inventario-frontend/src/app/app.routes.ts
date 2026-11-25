import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Productos } from './pages/productos/productos';
import { FullTecnologia } from './pages/full-tecnologia/full-tecnologia';
import { DahuaCamaras } from './pages/dahua-camaras/dahua-camaras';
import { SoporteTecnico } from './pages/soporte-tecnico/soporte-tecnico';
import { Traslados } from './pages/traslados/traslados';
import { Reportes } from './pages/reportes/reportes';
import { Kardex } from './pages/kardex/kardex';
import { Integracion } from './pages/integracion/integracion';
import { Usuarios } from './pages/usuarios/usuarios';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'productos', component: Productos },
  { path: 'full-tecnologia', component: FullTecnologia },
  { path: 'dahua-camaras', component: DahuaCamaras },
  { path: 'soporte-tecnico', component: SoporteTecnico },
  { path: 'traslados', component: Traslados },
  { path: 'reportes', component: Reportes },
  { path: 'kardex', component: Kardex },
  { path: 'integracion', component: Integracion },
  { path: 'usuarios', component: Usuarios },
];