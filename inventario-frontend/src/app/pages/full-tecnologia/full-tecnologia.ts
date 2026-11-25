import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockPorSede } from '../../models/producto.model';

@Component({
  selector: 'app-full-tecnologia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './full-tecnologia.html',
  styleUrl: './full-tecnologia.css'
})
export class FullTecnologia {
  mensajeAlerta = '';
  items: StockPorSede[] = [
    {
      id: 1,
      productoId: 26929,
      sedeId: 94,
      cantidadActual: 6,
      stockMinimoSede: 3,
      ubicacionFisica: 'Estante A-01',
      producto: {
        id: 26929,
        codigoSKU: 'GQY1JAY',
        idAlmacen: 93,
        areaNombre: 'Full Tecnología',
        nombre: 'SOFTWARE ESET NOD32 INTERNET SECURITY 1PC 3 AÑOS',
        unidad: 'UNIDADES',
        precioCosto: 30,
        precioVenta: 50,
        stockActual: 6,
        stockMinimo: 3,
        activo: true
      }
    },
    {
      id: 2,
      productoId: 26930,
      sedeId: 94,
      cantidadActual: 2,
      stockMinimoSede: 3,
      ubicacionFisica: 'Vitrina Principal',
      producto: {
        id: 26930,
        codigoSKU: '50036382441',
        idAlmacen: 93,
        areaNombre: 'Full Tecnología',
        nombre: 'HEADPHONE JBL HARMAN TRULY WIRELESS IVARY WAVE100',
        unidad: 'UNIDADES',
        precioCosto: 136.04,
        precioVenta: 170,
        stockActual: 2,
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
      this.mensajeAlerta = `⚠️ ALERTA DE STOCK: El producto ${item.producto?.nombre} en Tienda Full Tecnología cuenta con solo ${item.cantidadActual} unidades.`;
    }
  }
}