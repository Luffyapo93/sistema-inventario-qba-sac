import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdenServicio } from '../../models/producto.model';

@Component({
  selector: 'app-soporte-tecnico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './soporte-tecnico.html',
  styleUrl: './soporte-tecnico.css'
})
export class SoporteTecnico {
  ordenes: OrdenServicio[] = [
    { id: 1, clienteNombre: 'Juan Pérez', clienteTelefono: '987654321', equipoDispositivo: 'Laptop Lenovo IdeaPad', fallaReportada: 'No enciende / Revisión placa', montoServicio: 85, estado: 'Por reparar' },
    { id: 2, clienteNombre: 'Comercial Los Andes', clienteTelefono: '964112233', equipoDispositivo: 'DVR Dahua 8 Canales', fallaReportada: 'Configuración red P2P', montoServicio: 120, estado: 'Reparando' },
    { id: 3, clienteNombre: 'María Elena Ríos', clienteTelefono: '954332211', equipoDispositivo: 'PC Gamer Ryzen 5', fallaReportada: 'Mantenimiento preventivo y pasta térmica', montoServicio: 60, estado: 'Reparado' }
  ];

  nuevaOrden: OrdenServicio = { clienteNombre: '', clienteTelefono: '', equipoDispositivo: '', fallaReportada: '', montoServicio: 0, estado: 'Por reparar' };

  get totalPorReparar(): number { return this.ordenes.filter(o => o.estado === 'Por reparar').length; }
  get totalReparando(): number { return this.ordenes.filter(o => o.estado === 'Reparando').length; }
  get totalReparado(): number { return this.ordenes.filter(o => o.estado === 'Reparado').length; }
  get ingresosServicios(): number { return this.ordenes.reduce((acc, o) => acc + (Number(o.montoServicio) || 0), 0); }

  registrarOrden(): void {
    if (!this.nuevaOrden.clienteNombre || !this.nuevaOrden.equipoDispositivo) return;
    this.ordenes.unshift({ ...this.nuevaOrden, id: this.ordenes.length + 1 });
    this.nuevaOrden = { clienteNombre: '', clienteTelefono: '', equipoDispositivo: '', fallaReportada: '', montoServicio: 0, estado: 'Por reparar' };
  }

  cambiarEstado(orden: OrdenServicio, estado: 'Por reparar' | 'Reparando' | 'Reparado'): void {
    orden.estado = estado;
  }
}