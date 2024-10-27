import { Component } from '@angular/core';
import { Cliente } from '../../model/cliente';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { NgFor, NgIf } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente',
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
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css',
})
export class ClienteComponent {
  clientes: Cliente[] = [];
  visible: boolean = false;
  formCliente: FormGroup = new FormGroup({});
  isUpdate: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllClientes();
    this.formCliente = new FormGroup({
      id_cliente: new FormControl(''),
      nombre: new FormControl(''),
      apellido: new FormControl(''),
      dni: new FormControl(''),
    });
  }

  getAllClientes() {
    this.clienteService.getClientes().subscribe((data) => {
      this.clientes = data;
      console.log(this.clientes);
    });
  }

  showDialog() {
    this.visible = true;
    this.isUpdate = false;
  }

  resetFormCliente() {
    this.formCliente.reset();
  }

  selectCliente(cliente: any) {
    this.isUpdate = true;
    this.visible = true;
    this.formCliente.controls['id_cliente'].setValue(cliente.id_cliente);
    this.formCliente.controls['nombre'].setValue(cliente.nombre);
    this.formCliente.controls['apellido'].setValue(cliente.apellido);
    this.formCliente.controls['dni'].setValue(cliente.dni);
  }

  CrearClientes() {
    this.clienteService.createCliente(this.formCliente.value).subscribe({
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
            title: 'Cliente creado',
          });
          this.getAllClientes();
          this.formCliente.reset();
          this.visible = false;
        }
      },
      error: (err) => {
        console.error('Error creando el cliente', err);
      },
    });
  }

  actualizarCliente() {
    const cliente = this.formCliente.value;
    if (!cliente.id_cliente) {
      this.visible = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El cliente no tiene un ID válido para actualizar.',
        background: '#fff',
        customClass: {
          popup: 'custom-toast-popup',
        },
      });
      return;
    }

    if (cliente.dni > 8) {
      this.visible = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El DNI no puede ser mayor a 8 digitos.',
        background: '#fff',
        customClass: {
          popup: 'custom-toast-popup',
        },
      });
    }

    this.clienteService.updateCliente(cliente).subscribe({
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
            title: 'Clientes actualizado',
          });
          this.getAllClientes();
          this.formCliente.reset();
          this.visible = false;
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: 'Ocurrió un error al intentar actualizar el cliente. Intenta de nuevo más tarde.',
          background: '#fff',
          customClass: {
            popup: 'custom-toast-popup',
          },
        });
        console.error('Error al actualizar el cliente:', err);
      },
    });
  }

  eliminarCliente(idcliente: any) {
    Swal.fire({
      title: '¿Estás seguro de borrar este Cliente?',
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
        this.clienteService.deleteCliente(idcliente).subscribe((resp) => {
          this.getAllClientes();
        });
      }
    });
  }
}
