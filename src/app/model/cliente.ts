export class Cliente {
  idcliente: number;
  nombre: string;
  telefono: string;
  direccion: string;
  dni: string;

  constructor(
    idcliente: number,
    nombre: string,
    telefono: string,
    direccion: string,
    dni: string
  ) {
    this.idcliente = 0;
    this.nombre = '';
    this.telefono = '';
    this.direccion = '';
    this.dni = '';
  }
}
