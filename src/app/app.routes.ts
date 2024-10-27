import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { ProductoComponent } from './component/producto/producto.component';
import { ClienteComponent } from './component/cliente/cliente.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Página de Inicio',
  },
  {
    path: 'producto',
    component: ProductoComponent,
    title: 'Producto',
  },
  {
    path: 'cliente',
    component: ClienteComponent,
    title: 'Cliente',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
