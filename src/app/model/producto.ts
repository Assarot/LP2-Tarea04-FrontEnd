export class Producto {
  idproducto: number;
  nombre: string;
  stock: number;
  precio: number;
  estado: string;

  constructor(
    idproducto: number,
    nombre: string,
    stock: number,
    precio: number,
    estado: string
  ) {
    this.idproducto = 0;
    this.nombre = '';
    this.stock = 0;
    this.precio = 0;
    this.estado = '';
  }
}
