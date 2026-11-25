import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FilaImportacionCSV {
  codigoSKU: string;
  nombre: string;
  sedeDestino: string;
  tipoOperacion: 'CATALOGO' | 'COMPRA' | 'VENTA';
  cantidad: number;
  documentoRef: string;
  estadoValidacion: 'LISTO' | 'ALERTA_STOCK' | 'PROCESADO';
}

@Component({
  selector: 'app-integracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './integracion.html',
  styleUrl: './integracion.css'
})
export class Integracion {
  tipoCargaSeleccionada = 'VENTAS_MYCOMPANY';
  mensajeExito = '';

  filasPrevisualizacion: FilaImportacionCSV[] = [
    { codigoSKU: 'GQY1JAY', nombre: 'SOFTWARE ESET NOD32 INTERNET SECURITY 1PC 3 AÑOS', sedeDestino: 'Tienda Full Tecnología', tipoOperacion: 'VENTA', cantidad: 2, documentoRef: 'FAC-F001-04521', estadoValidacion: 'ALERTA_STOCK' },
    { codigoSKU: '6939550000000', nombre: 'FUENTE DE PODER CENTRALIZADA DAHUA DH-PFM341-9CH', sedeDestino: 'Tienda Dahua', tipoOperacion: 'COMPRA', cantidad: 5, documentoRef: 'GUIA-002-00145', estadoValidacion: 'LISTO' }
  ];

  alSeleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const lines = ((e.target?.result as string) || '').split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length > 1) {
        this.filasPrevisualizacion = lines.slice(1).map(line => {
          const cols = line.split(',');
          return {
            codigoSKU: cols[1]?.trim() || cols[0]?.trim() || 'SKU',
            nombre: (cols[3] || cols[1] || 'Producto').replace(/"/g, '').trim(),
            sedeDestino: 'Almacén Corporativo (#93)',
            tipoOperacion: this.tipoCargaSeleccionada === 'COMPRAS_MYCOMPANY' ? 'COMPRA' : 'VENTA',
            cantidad: Number(cols[7] || cols[3]) || 1,
            documentoRef: 'CSV-MYCOMPANY',
            estadoValidacion: 'LISTO'
          };
        });
      }
    };
    reader.readAsText(input.files[0]);
  }

  ejecutarSincronizacion(): void {
    this.filasPrevisualizacion.forEach(f => (f.estadoValidacion = 'PROCESADO'));
    this.mensajeExito = `✅ Lote sincronizado: ${this.filasPrevisualizacion.length} registros actualizados en tiempo real.`;
  }

  descargarPlantillaCSV(): void {
    const titulo = ',,,Lista de Productos,,,,\n';
    const head = 'ID,CÓDIGO,ID Almacén,Producto/Servicio,Unidad,Costo,Precio Venta,Stock\n';
    const row = '26929,GQY1JAY,93,"SOFTWARE ESET NOD32 INTERNET SECURITY 1PC 3 AÑOS",UNIDADES,"S/ 30","S/ 50",8';
    const blob = new Blob(['\uFEFF' + titulo + head + row], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Plantilla_Lista_Productos_MyCompany.csv';
    a.click();
  }
}