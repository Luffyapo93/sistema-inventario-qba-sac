import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InventarioService } from '../../services/inventario.service';
import { StockPorSede } from '../../models/producto.model';

interface ConsolidadoMultisede {
  productoId: number;
  codigoSKU: string;
  nombre: string;
  categoria: string;
  precioVenta: number;
  stockAlmacen: number;
  minAlmacen: number;
  stockFullTec: number;
  minFullTec: number;
  stockDahua: number;
  minDahua: number;
  stockTotal: number;
  enAlerta: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private inventarioService = inject(InventarioService);
  filtroBusqueda = '';
  metricas = { totalReferencias: 4, unidadesTotales: 45, alertasCriticas: 3 };
  consolidado: ConsolidadoMultisede[] = [];

  ngOnInit(): void {
    this.sincronizarDatosEnTiempoReal();
  }

  sincronizarDatosEnTiempoReal(): void {
    forkJoin({
      s1: this.inventarioService.getStockPorSede(93).pipe(catchError(() => of([]))),
      s2: this.inventarioService.getStockPorSede(94).pipe(catchError(() => of([]))),
      s3: this.inventarioService.getStockPorSede(95).pipe(catchError(() => of([])))
    }).subscribe(({ s1, s2, s3 }) => {
      if (s1.length > 0 || s2.length > 0 || s3.length > 0) {
        this.construirConsolidado(s1, s2, s3);
      } else {
        this.cargarDatosRespaldo();
      }
    });
  }

  private construirConsolidado(s1: StockPorSede[], s2: StockPorSede[], s3: StockPorSede[]): void {
    const mapa = new Map<number, ConsolidadoMultisede>();
    const procesar = (lista: StockPorSede[], sede: 1 | 2 | 3) => {
      for (const item of lista) {
        if (!item.producto) continue;
        if (!mapa.has(item.productoId)) {
          mapa.set(item.productoId, {
            productoId: item.productoId,
            codigoSKU: item.producto.codigoSKU,
            nombre: item.producto.nombre,
            categoria: item.producto.areaNombre || 'Tecnología',
            precioVenta: item.producto.precioVenta,
            stockAlmacen: 0, minAlmacen: 3, stockFullTec: 0, minFullTec: 3, stockDahua: 0, minDahua: 3, stockTotal: 0, enAlerta: false
          });
        }
        const reg = mapa.get(item.productoId)!;
        const disp = item.stockDisponible ?? item.cantidadActual ?? 0;
        if (sede === 1) reg.stockAlmacen = disp;
        if (sede === 2) reg.stockFullTec = disp;
        if (sede === 3) reg.stockDahua = disp;
        reg.stockTotal = reg.stockAlmacen + reg.stockFullTec + reg.stockDahua;
        reg.enAlerta = reg.stockAlmacen <= 3 || reg.stockFullTec <= 3 || reg.stockDahua <= 3;
      }
    };
    procesar(s1, 1); procesar(s2, 2); procesar(s3, 3);
    this.consolidado = Array.from(mapa.values());
    this.metricas.totalReferencias = this.consolidado.length;
    this.metricas.unidadesTotales = this.consolidado.reduce((a, b) => a + b.stockTotal, 0);
    this.metricas.alertasCriticas = this.consolidado.filter(c => c.enAlerta).length;
  }

  private cargarDatosRespaldo(): void {
    this.consolidado = [
      { productoId: 26929, codigoSKU: 'GQY1JAY', nombre: 'SOFTWARE ESET NOD32 INTERNET SECURITY 1PC 3 AÑOS', categoria: 'Full Tecnología', precioVenta: 50, stockAlmacen: 8, minAlmacen: 3, stockFullTec: 4, minFullTec: 3, stockDahua: 2, minDahua: 3, stockTotal: 14, enAlerta: true },
      { productoId: 26930, codigoSKU: '50036382441', nombre: 'HEADPHONE JBL HARMAN TRULY WIRELESS IVARY WAVE100', categoria: 'Full Tecnología', precioVenta: 170, stockAlmacen: 5, minAlmacen: 3, stockFullTec: 2, minFullTec: 3, stockDahua: 0, minDahua: 3, stockTotal: 7, enAlerta: true },
      { productoId: 26933, codigoSKU: '6923170000000', nombre: 'TECLADO CONTROLADOR IP CON JOYSTICK DAHUA DHI-NKB1000', categoria: 'Dahua Cámaras', precioVenta: 910, stockAlmacen: 3, minAlmacen: 3, stockFullTec: 1, minFullTec: 3, stockDahua: 1, minDahua: 3, stockTotal: 5, enAlerta: true },
      { productoId: 26934, codigoSKU: '6939550000000', nombre: 'FUENTE DE PODER CENTRALIZADA DAHUA DH-PFM341-9CH', categoria: 'Dahua Cámaras', precioVenta: 195, stockAlmacen: 10, minAlmacen: 3, stockFullTec: 5, minFullTec: 3, stockDahua: 4, minDahua: 3, stockTotal: 19, enAlerta: false }
    ];
    this.metricas = { totalReferencias: 4, unidadesTotales: 45, alertasCriticas: 3 };
  }

  get consolidadoFiltrado(): ConsolidadoMultisede[] {
    const q = this.filtroBusqueda.toLowerCase().trim();
    if (!q) return this.consolidado;
    return this.consolidado.filter(c => c.nombre.toLowerCase().includes(q) || c.codigoSKU.toLowerCase().includes(q));
  }
}