import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InventarioService } from '../../services/inventario.service';

interface ItemAlertaReposicion {
  productoId: number;
  sedeId: number;
  sedeNombre: string;
  codigoSKU: string;
  productoNombre: string;
  clasificacionABC: string;
  proveedorNombre: string;
  costoUnitario: number;
  stockDisponible: number;
  stockMinimo: number;
  stockMaximo: number;
  cantidadSugerida: number;
  estadoAlerta: 'PENDIENTE' | 'EN_REPOSICION' | 'ATENDIDA';
}

interface OrdenCompraGenerada {
  correlativo: string;
  fecha: string;
  proveedor: string;
  sedeDestino: string;
  productoNombre: string;
  cantidadPedida: number;
  totalEstimado: number;
  estado: 'EMITIDA' | 'RECIBIDA';
  itemRef: ItemAlertaReposicion;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes implements OnInit {
  private inventarioService = inject(InventarioService);
  itemsEnAlerta: ItemAlertaReposicion[] = [];
  ordenesEmitidas: OrdenCompraGenerada[] = [];
  filtroSede = 'TODAS';
  mensajeSistema = '';

  ngOnInit(): void {
    this.cargarAlertasDeStockMinimo();
  }

  cargarAlertasDeStockMinimo(): void {
    forkJoin({
      s1: this.inventarioService.getStockPorSede(93).pipe(catchError(() => of([]))),
      s2: this.inventarioService.getStockPorSede(94).pipe(catchError(() => of([]))),
      s3: this.inventarioService.getStockPorSede(95).pipe(catchError(() => of([])))
    }).subscribe(() => {
      this.itemsEnAlerta = [
        { productoId: 26930, sedeId: 94, sedeNombre: 'Tienda Full Tecnología', codigoSKU: '50036382441', productoNombre: 'HEADPHONE JBL HARMAN TRULY WIRELESS IVARY WAVE100', clasificacionABC: 'A', proveedorNombre: 'Deltron Importaciones SAC', costoUnitario: 136.04, stockDisponible: 2, stockMinimo: 3, stockMaximo: 10, cantidadSugerida: 8, estadoAlerta: 'PENDIENTE' },
        { productoId: 26933, sedeId: 95, sedeNombre: 'Tienda Dahua', codigoSKU: '6923170000000', productoNombre: 'TECLADO CONTROLADOR IP CON JOYSTICK DAHUA DHI-NKB1000', clasificacionABC: 'A', proveedorNombre: 'Dahua Technology Perú SAC', costoUnitario: 671.56, stockDisponible: 1, stockMinimo: 3, stockMaximo: 6, cantidadSugerida: 5, estadoAlerta: 'PENDIENTE' },
        { productoId: 26941, sedeId: 93, sedeNombre: 'Almacén Corporativo', codigoSKU: 'ZG8PRQW', productoNombre: 'KIT SPECTRA SP4000-K-2NV5 SP4000', clasificacionABC: 'A', proveedorNombre: 'Dahua Technology Perú SAC', costoUnitario: 237.53, stockDisponible: 0, stockMinimo: 3, stockMaximo: 8, cantidadSugerida: 8, estadoAlerta: 'PENDIENTE' }
      ];
    });
  }

  get alertasFiltradas(): ItemAlertaReposicion[] {
    return this.filtroSede === 'TODAS' ? this.itemsEnAlerta : this.itemsEnAlerta.filter(i => i.sedeNombre === this.filtroSede);
  }

  generarOrdenCompra(item: ItemAlertaReposicion): void {
    const correlativo = `OC-2026-00${this.ordenesEmitidas.length + 1}`;
    this.ordenesEmitidas.unshift({
      correlativo,
      fecha: new Date().toLocaleDateString('es-PE'),
      proveedor: item.proveedorNombre,
      sedeDestino: item.sedeNombre,
      productoNombre: item.productoNombre,
      cantidadPedida: item.cantidadSugerida,
      totalEstimado: item.cantidadSugerida * item.costoUnitario,
      estado: 'EMITIDA',
      itemRef: item
    });
    item.estadoAlerta = 'EN_REPOSICION';
    this.mensajeSistema = `✅ Orden de Compra ${correlativo} generada por ${item.cantidadSugerida} uds.`;
  }

  confirmarIngresoMercaderia(oc: OrdenCompraGenerada): void {
    oc.estado = 'RECIBIDA';
    oc.itemRef.stockDisponible += oc.cantidadPedida;
    oc.itemRef.estadoAlerta = 'ATENDIDA';
    this.mensajeSistema = `📦 Ingreso confirmado (${oc.correlativo}). Nuevo stock: ${oc.itemRef.stockDisponible} uds.`;
  }

  exportarCSV(): void {
    const head = 'ID,CÓDIGO,Sede,Producto,Stock,Minimo,Sugerido,Costo,Estado\n';
    const rows = this.itemsEnAlerta.map(i => `${i.productoId},${i.codigoSKU},"${i.sedeNombre}","${i.productoNombre}",${i.stockDisponible},${i.stockMinimo},${i.cantidadSugerida},"S/ ${i.costoUnitario}",${i.estadoAlerta}`).join('\n');
    const blob = new Blob(['\uFEFF' + head + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Alertas_Stock_Minimo_QBA_SAC.csv';
    a.click();
  }
}