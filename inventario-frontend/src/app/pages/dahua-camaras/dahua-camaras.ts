import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockPorSede } from '../../models/producto.model';

@Component({
  selector: 'app-dahua-camaras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dahua-camaras.html',
  styleUrl: './dahua-camaras.css'
})
export class DahuaCamaras {
  mensajeAlerta = '';
  items: StockPorSede[] = [
    {
      id: 1,
      productoId: 26933,
      sedeId: 95,
      cantidadActual: 1,
      stockMinimoSede: 3,
      ubicacionFisica: 'Módulo Controladores',
      producto: {
        id: 26933,
        codigoSKU: '6923170000000',
        idAlmacen: 93,
        areaNombre: 'Dahua Cámaras',
        nombre: 'TECLADO CONTROLADOR IP CON JOYSTICK DAHUA DHI-NKB1000',
        unidad: 'UNIDADES',
        precioCosto: 671.56,
        precioVenta: 910,
        stockActual: 1,
        stockMinimo: 3,
        activo: true
      }
    },
    {
      id: 2,
      productoId: 26934,
      sedeId: 95,
      cantidadActual: 5,
      stockMinimoSede: 3,
      ubicacionFisica: 'Módulo Energía',
      producto: {
        id: 26934,
        codigoSKU: '6939550000000',
        idAlmacen: 93,
        areaNombre: 'Dahua Cámaras',
        nombre: 'FUENTE DE PODER CENTRALIZADA DAHUA DH-PFM341-9CH',
        unidad: 'UNIDADES',
        precioCosto: 152.75,
        precioVenta: 195,
        stockActual: 5,
        stockMinimo: 3,
        activo: true
      }
    }
  ];

  get totalUnidades(): number {
    return this.items.reduce((acc, i) => acc + i.cantidadActual, 0);
  }

  get totalCriticos(): number {
    return this.items.filter(i => i.cantidadActual <= i.stockMinimoSede).length;
  }

  registrarSalida(item: StockPorSede): void {
    if (item.cantidadActual <= 0) return;
    item.cantidadActual -= 1;
    if (item.cantidadActual <= item.stockMinimoSede) {
      this.mensajeAlerta = `⚠️ ALERTA DE STOCK: El producto ${item.producto?.nombre} en Tienda Dahua Cámaras cuenta con solo ${item.cantidadActual} unidades.`;
    }
  }
}