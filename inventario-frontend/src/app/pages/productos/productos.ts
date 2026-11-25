import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7107/api/productos';

  productos: Producto[] = [
    { id: 26929, codigoSKU: 'GQY1JAY', idAlmacen: 93, areaNombre: 'Full Tecnología', nombre: 'SOFTWARE ESET NOD32 INTERNET SECURITY 1PC 3 AÑOS', unidad: 'UNIDADES', precioCosto: 30, precioVenta: 50, stockActual: 8, stockMinimo: 3, activo: true },
    { id: 26930, codigoSKU: '50036382441', idAlmacen: 93, areaNombre: 'Full Tecnología', nombre: 'HEADPHONE JBL HARMAN TRULY WIRELESS IVARY WAVE100', unidad: 'UNIDADES', precioCosto: 136.04, precioVenta: 170, stockActual: 2, stockMinimo: 3, activo: true },
    { id: 26933, codigoSKU: '6923170000000', idAlmacen: 93, areaNombre: 'Dahua Cámaras', nombre: 'TECLADO CONTROLADOR IP CON JOYSTICK DAHUA DHI-NKB1000', unidad: 'UNIDADES', precioCosto: 671.56, precioVenta: 910, stockActual: 1, stockMinimo: 3, activo: true },
    { id: 26934, codigoSKU: '6939550000000', idAlmacen: 93, areaNombre: 'Dahua Cámaras', nombre: 'FUENTE DE PODER CENTRALIZADA DAHUA DH-PFM341-9CH', unidad: 'UNIDADES', precioCosto: 152.75, precioVenta: 195, stockActual: 5, stockMinimo: 3, activo: true },
    { id: 26936, codigoSKU: 'JI2K7M3', idAlmacen: 93, areaNombre: 'Almacén Central', nombre: 'CANALETA C/ADESIVO SATRA 24*14 BLANCO', unidad: 'UNIDADES', precioCosto: 3.39, precioVenta: 6, stockActual: 25, stockMinimo: 5, activo: true },
    { id: 26939, codigoSKU: 'H1W6MDM', idAlmacen: 93, areaNombre: 'Dahua Cámaras', nombre: 'TRANSFORMADOR TRA-2A60 AC220V', unidad: 'UNIDADES', precioCosto: 23.52, precioVenta: 35, stockActual: 3, stockMinimo: 3, activo: true },
    { id: 26941, codigoSKU: 'ZG8PRQW', idAlmacen: 93, areaNombre: 'Dahua Cámaras', nombre: 'KIT SPECTRA SP4000-K-2NV5 SP4000', unidad: 'UNIDADES', precioCosto: 237.53, precioVenta: 300, stockActual: 0, stockMinimo: 3, activo: true }
  ];

  filtroTexto = '';
  filtroAlmacen = 'TODOS';
  filtroSoloCriticos = false;
  mostrarModal = false;
  modoEdicion = false;
  mensajeNotificacion = '';

  productoForm: Partial<Producto> = { id: 26945, codigoSKU: '', idAlmacen: 93, areaNombre: 'Full Tecnología', nombre: '', unidad: 'UNIDADES', precioCosto: 0, precioVenta: 0, stockActual: 0, stockMinimo: 3, activo: true };

  ngOnInit(): void {
    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (data) => { if (data && data.length > 0) this.productos = data; },
      error: () => {}
    });
  }

  get productosFiltrados(): Producto[] {
    return this.productos.filter((p) => {
      const q = this.filtroTexto.toLowerCase().trim();
      const matchTxt = !q || p.nombre.toLowerCase().includes(q) || p.codigoSKU.toLowerCase().includes(q) || p.id.toString().includes(q);
      const matchArea = this.filtroAlmacen === 'TODOS' || p.areaNombre === this.filtroAlmacen;
      const matchCrit = !this.filtroSoloCriticos || p.stockActual <= p.stockMinimo;
      return matchTxt && matchArea && matchCrit;
    });
  }

  get totalStockCritico(): number {
    return this.productos.filter(p => p.stockActual <= p.stockMinimo).length;
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    const maxId = this.productos.reduce((m, p) => p.id > m ? p.id : m, 26943);
    this.productoForm = { id: maxId + 1, codigoSKU: '', idAlmacen: 93, areaNombre: 'Full Tecnología', nombre: '', unidad: 'UNIDADES', precioCosto: 0, precioVenta: 0, stockActual: 0, stockMinimo: 3, activo: true };
    this.mostrarModal = true;
  }

  abrirModalEditar(prod: Producto): void {
    this.modoEdicion = true;
    this.productoForm = { ...prod };
    this.mostrarModal = true;
  }

  cerrarModal(): void { this.mostrarModal = false; }

  guardarProducto(): void {
    if (!this.productoForm.nombre || !this.productoForm.codigoSKU) return;
    const payload = { ...this.productoForm, codigoSKU: this.productoForm.codigoSKU!.toUpperCase(), nombre: this.productoForm.nombre!.toUpperCase(), activo: true } as Producto;
    if (this.modoEdicion) {
      this.http.put(`${this.apiUrl}/${payload.id}`, payload).subscribe({ next: () => {}, error: () => {} });
      const idx = this.productos.findIndex(p => p.id === payload.id);
      if (idx !== -1) this.productos[idx] = payload;
      this.notificar(`Producto "${payload.nombre}" actualizado.`);
    } else {
      this.http.post(this.apiUrl, payload).subscribe({ next: () => {}, error: () => {} });
      this.productos.unshift(payload);
      this.notificar(`Producto "${payload.nombre}" registrado.`);
    }
    this.cerrarModal();
  }

  eliminarProducto(prod: Producto): void {
    if (!confirm(`¿Eliminar "${prod.nombre}"?`)) return;
    this.http.delete(`${this.apiUrl}/${prod.id}`).subscribe({ next: () => {}, error: () => {} });
    this.productos = this.productos.filter(p => p.id !== prod.id);
    this.notificar(`Producto eliminado.`);
  }

  exportarListaProductosExcel(): void {
    const titulo = ',,,Lista de Productos,,,,\n';
    const head = 'ID,CÓDIGO,ID Almacén,Producto/Servicio,Unidad,Costo,Precio Venta,Stock\n';
    const rows = this.productosFiltrados.map(p => `${p.id},${p.codigoSKU},${p.idAlmacen},"${p.nombre}",${p.unidad},"S/ ${p.precioCosto}","S/ ${p.precioVenta}",${p.stockActual}`).join('\n');
    const blob = new Blob(['\uFEFF' + titulo + head + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lista_de_Productos_QBA_SAC.csv`;
    a.click();
    this.notificar('Excel "Lista de Productos" exportado.');
  }

  private notificar(msg: string): void {
    this.mensajeNotificacion = msg;
    setTimeout(() => this.mensajeNotificacion = '', 4000);
  }
}