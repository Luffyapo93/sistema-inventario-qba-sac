import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Producto, StockPorSede, AlertaStock } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private http = inject(HttpClient);
  // Puerto activo en tu consola de Visual Studio
  private apiUrl = 'https://localhost:7107/api/productos';

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getStockPorSede(sedeId: number): Observable<StockPorSede[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stock-sede/${sedeId}`).pipe(
      map((items) =>
        items.map((item) => ({
          ...item,
          stockDisponible: item.stockDisponible ?? item.cantidadActual ?? 0,
          stockMinimo: item.stockMinimo ?? item.stockMinimoSede ?? 3,
          stockMaximo: item.stockMaximo ?? 20,
          cantidadActual: item.stockDisponible ?? item.cantidadActual ?? 0,
          stockMinimoSede: item.stockMinimo ?? item.stockMinimoSede ?? 3
        }))
      )
    );
  }

  getAlertasPendientes(): Observable<AlertaStock[]> {
    return this.http.get<AlertaStock[]>(`${this.apiUrl}/alertas-pendientes`);
  }

  descontarStock(productoId: number, sedeId: number, cantidad: number, numeroDocumento?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/descontar-stock`, {
      productoId,
      sedeId,
      cantidad,
      usuarioId: 1,
      numeroDocumento
    });
  }

  registrarEntrada(productoId: number, sedeId: number, cantidad: number, costoUnitario: number, numeroDocumento?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar-entrada`, {
      productoId,
      sedeId,
      cantidad,
      costoUnitario,
      usuarioId: 1,
      numeroDocumento
    });
  }

  configurarLimitesStock(productoId: number, sedeId: number, stockMinimo: number, stockMaximo: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/configurar-limites`, {
      productoId,
      sedeId,
      stockMinimo,
      stockMaximo
    });
  }
}