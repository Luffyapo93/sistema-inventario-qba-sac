import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistroKardex } from '../../models/producto.model';

@Component({
  selector: 'app-kardex',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kardex.html',
  styleUrl: './kardex.css'
})
export class Kardex {
  filtroSede = 'TODAS';
  filtroProducto = 'TODOS';

  registros: RegistroKardex[] = [
    {
      id: 1,
      productoId: 26929,
      productoSKU: 'GQY1JAY',
      productoNombre: 'SOFTWARE ESET NOD32 INTERNET SECURITY 1PC 3 AÑOS',
      sedeId: 93,
      sedeNombre: 'Almacén Corporativo',
      fecha: '01/11/2026',
      tipoOperacion: 'SALDO INICIAL',
      documentoReferencia: 'INV-2026-001',
      cantidadEntrada: 10,
      costoUnitarioEntrada: 30,
      totalEntrada: 300,
      cantidadSalida: 0,
      costoUnitarioSalida: 0,
      totalSalida: 0,
      saldoCantidad: 10,
      saldoCostoUnitario: 30,
      saldoTotal: 300
    },
    {
      id: 2,
      productoId: 26929,
      productoSKU: 'GQY1JAY',
      productoNombre: 'SOFTWARE ESET NOD32 INTERNET SECURITY 1PC 3 AÑOS',
      sedeId: 94,
      sedeNombre: 'Tienda Full Tecnología',
      fecha: '12/11/2026',
      tipoOperacion: 'SALIDA VENTA',
      documentoReferencia: 'BOL-B001-0451',
      cantidadEntrada: 0,
      costoUnitarioEntrada: 0,
      totalEntrada: 0,
      cantidadSalida: 2,
      costoUnitarioSalida: 30,
      totalSalida: 60,
      saldoCantidad: 8,
      saldoCostoUnitario: 30,
      saldoTotal: 240
    },
    {
      id: 3,
      productoId: 26934,
      productoSKU: '6939550000000',
      productoNombre: 'FUENTE DE PODER CENTRALIZADA DAHUA DH-PFM341-9CH',
      sedeId: 95,
      sedeNombre: 'Tienda Dahua',
      fecha: '18/11/2026',
      tipoOperacion: 'ENTRADA COMPRA',
      documentoReferencia: 'FAC-F002-1190',
      cantidadEntrada: 5,
      costoUnitarioEntrada: 152.75,
      totalEntrada: 763.75,
      cantidadSalida: 0,
      costoUnitarioSalida: 0,
      totalSalida: 0,
      saldoCantidad: 5,
      saldoCostoUnitario: 152.75,
      saldoTotal: 763.75
    }
  ];

  get registrosFiltrados(): RegistroKardex[] {
    return this.registros.filter(r => {
      const matchSede = this.filtroSede === 'TODAS' || r.sedeNombre === this.filtroSede;
      const matchProd = this.filtroProducto === 'TODOS' || r.productoSKU === this.filtroProducto;
      return matchSede && matchProd;
    });
  }

  get totalEntradasValorizado(): number {
    return this.registrosFiltrados.reduce((acc, r) => acc + r.totalEntrada, 0);
  }

  get totalSalidasValorizado(): number {
    return this.registrosFiltrados.reduce((acc, r) => acc + r.totalSalida, 0);
  }

  get valorPatrimonialActual(): number {
    return this.totalEntradasValorizado - this.totalSalidasValorizado;
  }

  exportarKardexCSV(): void {
    const head = 'Fecha,Sede,SKU,Producto,Tipo,Documento,Entrada_Cant,Entrada_Total,Salida_Cant,Salida_Total,Saldo_Cant,Saldo_Total\n';
    const rows = this.registrosFiltrados
      .map(r => `${r.fecha},"${r.sedeNombre}",${r.productoSKU},"${r.productoNombre}",${r.tipoOperacion},${r.documentoReferencia},${r.cantidadEntrada},${r.totalEntrada},${r.cantidadSalida},${r.totalSalida},${r.saldoCantidad},${r.saldoTotal}`)
      .join('\n');
    const blob = new Blob(['\uFEFF' + head + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Kardex_Valorizado_QBA_SAC.csv';
    a.click();
  }
}