import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { Producto } from '../../model/producto';
import { ProductoService } from '../../services/producto.service';
import { TableModule } from 'primeng/table';
import { NgFor, NgIf } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [
    HomeComponent,
    TableModule,
    ButtonModule,
    ButtonGroupModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css',
})
export class ProductoComponent {
  producto: Producto[] = [];
  visible: boolean = false;
  formProducto: FormGroup = new FormGroup({});
  isUpdate: boolean = false;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.listarproductos();
  }
  listarproductos() {
    this.productoService.getproductos().subscribe((data) => {
      this.producto = data;
    });
  }

  showDialog() {
    this.visible = true;
    this.isUpdate = false;
  }

  resetFormProducto() {
    this.formProducto.reset();
  }

  selectProducto(producto: any) {
    this.isUpdate = true;
    this.visible = true;
    this.formProducto.controls['id_producto'].setValue(producto.id_producto);
    this.formProducto.controls['nombre'].setValue(producto.nombre);
    this.formProducto.controls['stock'].setValue(producto.stock);
    this.formProducto.controls['precio'].setValue(producto.precio);
  }

  crearproductos() {
    this.productoService.createProducto(this.formProducto.value).subscribe({
      next: (resp) => {
        if (resp) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#fff',
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
            customClass: {
              popup: 'custom-toast-popup',
            },
          });
          Toast.fire({
            icon: 'success',
            title: 'Producto creado',
          });
          this.listarproductos();
          this.formProducto.reset();
          this.visible = false;
        }
      },
      error: (err) => {
        console.error('Error creando el producto', err);
      },
    });
  }

  actualizarProducto() {
    const producto = this.formProducto.value;
    if (!producto.id_producto) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El producto no tiene un ID válido para actualizar.',
        background: '#fff',
        customClass: {
          popup: 'custom-toast-popup',
        },
      });
      return;
    }

    this.productoService.updateProducto(producto).subscribe({
      next: (resp) => {
        if (resp) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#fff',
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
            customClass: {
              popup: 'custom-toast-popup',
            },
          });

          Toast.fire({
            icon: 'success',
            title: 'Producto actualizado',
          });
          this.listarproductos();
          this.formProducto.reset();
          this.visible = false;
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: 'Ocurrió un error al intentar actualizar el producto. Intenta de nuevo más tarde.',
          background: '#fff',
          customClass: {
            popup: 'custom-toast-popup',
          },
        });
        console.error('Error al actualizar el producto:', err);
      },
    });
  }

  eliminarProducto(id_producto: any) {
    Swal.fire({
      title: '¿Estás seguro de borrar este Producto?',
      text: '¡No serás capaz de reveritrlo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#19e212',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borralo!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '¡Borrado!',
          text: 'El dato ha sido borrado',
          icon: 'success',
        });
        this.productoService.deleteProducto(id_producto).subscribe((resp) => {
          this.listarproductos();
        });
      }
    });
  }
}
