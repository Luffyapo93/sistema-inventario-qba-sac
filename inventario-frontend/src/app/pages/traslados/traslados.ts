import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Producto, TrasladoSede } from '../../models/producto.model';

@Component({
  selector: 'app-traslados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './traslados.html',
  styleUrl: './traslados.css'
})
export class Traslados {
  authService = inject(AuthService);

  productosDisponibles: Producto[] = [
    { id: 26929, codigoSKU: 'GQY1JAY', idAlmacen: 93, areaNombre: 'Full Tecnología', nombre: 'SOFTWARE ESET NOD32 INTERNET SECURITY 1PC 3 AÑOS', unidad: 'UNIDADES', precioCosto: 30, precioVenta: 50, stockActual: 8, stockMinimo: 3, activo: true },
    { id: 26934, codigoSKU: '6939550000000', idAlmacen: 93, areaNombre: 'Dahua Cámaras', nombre: 'FUENTE DE PODER CENTRALIZADA DAHUA DH-PFM341-9CH', unidad: 'UNIDADES', precioCosto: 152.75, precioVenta: 195, stockActual: 5, stockMinimo: 3, activo: true },
    { id: 26936, codigoSKU: 'JI2K7M3', idAlmacen: 93, areaNombre: 'Almacén Central', nombre: 'CANALETA C/ADESIVO SATRA 24*14 BLANCO', unidad: 'UNIDADES', precioCosto: 3.39, precioVenta: 6, stockActual: 25, stockMinimo: 5, activo: true }
  ];

  listaTraslados: TrasladoSede[] = [
    { id: 101, productoId: 26934, sedeOrigenId: 93, sedeDestinoId: 95, cantidad: 2, usuarioEnviaId: 2, observacionEnvio: 'Reposición vitrina Dahua', estado: 'EN_TRANSITO', fechaEnvio: '21/11/2026 09:30', producto: this.productosDisponibles[1], sedeOrigen: { id: 93, nombre: 'Almacén (#93)' }, sedeDestino: { id: 95, nombre: 'Tienda Dahua Cámaras' } },
    { id: 102, productoId: 26929, sedeOrigenId: 93, sedeDestinoId: 94, cantidad: 3, usuarioEnviaId: 1, observacionEnvio: 'Stock licencias Full Tec.', estado: 'EN_TRANSITO', fechaEnvio: '21/11/2026 10:15', producto: this.productosDisponibles[0], sedeOrigen: { id: 93, nombre: 'Almacén (#93)' }, sedeDestino: { id: 94, nombre: 'Tienda Full Tecnología' } }
  ];

  nuevoEnvio = { productoId: 26936, sedeOrigenId: 93, sedeDestinoId: 94, cantidad: 2, observacionEnvio: '' };
  mensajeSistema = '';

  get puedeDespacharTraspasos(): boolean {
    return this.authService.tienePermiso(['Administrador', 'JefeAlmacen', 'AsistenteAlmacen']);
  }

  get trasladosPorConfirmar(): TrasladoSede[] {
    const user = this.authService.usuarioActual();
    const pendientes = this.listaTraslados.filter(t => t.estado === 'EN_TRANSITO');
    if (!user || this.puedeDespacharTraspasos) return pendientes;
    return pendientes.filter(t => t.sedeDestinoId === user.sedeId);
  }

  get historialCompletados(): TrasladoSede[] {
    return this.listaTraslados.filter(t => t.estado === 'RECIBIDO');
  }

  despacharTraspaso(): void {
    const prod = this.productosDisponibles.find(p => p.id === Number(this.nuevoEnvio.productoId));
    if (!prod || this.nuevoEnvio.cantidad <= 0 || prod.stockActual < this.nuevoEnvio.cantidad) return;
    prod.stockActual -= this.nuevoEnvio.cantidad;
    const destId = Number(this.nuevoEnvio.sedeDestinoId);
    this.listaTraslados.unshift({
      id: 100 + this.listaTraslados.length + 1,
      productoId: prod.id,
      sedeOrigenId: 93,
      sedeDestinoId: destId,
      cantidad: this.nuevoEnvio.cantidad,
      usuarioEnviaId: 1,
      observacionEnvio: this.nuevoEnvio.observacionEnvio || 'Envío de mercadería',
      estado: 'EN_TRANSITO',
      fechaEnvio: new Date().toLocaleString('es-PE'),
      producto: { ...prod },
      sedeOrigen: { id: 93, nombre: 'Almacén (#93)' },
      sedeDestino: { id: destId, nombre: destId === 94 ? 'Tienda Full Tecnología' : 'Tienda Dahua Cámaras' }
    });
    this.mensajeSistema = `🚚 Traspaso enviado (${this.nuevoEnvio.cantidad} uds de ${prod.nombre}). Pendiente de confirmación en tienda.`;
    setTimeout(() => this.mensajeSistema = '', 4500);
  }

  confirmarRecepcion(t: TrasladoSede): void {
    t.estado = 'RECIBIDO';
    t.fechaConfirmacion = new Date().toLocaleString('es-PE');
    t.observacionRecepcion = `Recibido por ${this.authService.usuarioActual()?.nombreCompleto}`;
    this.mensajeSistema = `✅ Recepción confirmada del Traspaso #${t.id} (${t.producto?.nombre}).`;
    setTimeout(() => this.mensajeSistema = '', 4500);
  }
}