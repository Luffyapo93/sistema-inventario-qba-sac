export interface Sede {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
}

export interface Producto {
  id: number;                // Ej: 26929
  codigoSKU: string;         // Ej: GQY1JAY
  idAlmacen: number;         // Ej: 93
  areaNombre: string;        // Ej: 'Full Tecnología' | 'Dahua Cámaras' | 'Almacén Central'
  categoriaNombre?: string;  // Alias compatible
  nombre: string;            // Producto/Servicio
  unidad: string;            // Ej: 'UNIDADES'
  precioCosto: number;
  precioVenta: number;
  stockActual: number;
  stockMinimo: number;
  stockMinimoGlobal?: number;
  activo: boolean;
}

export interface StockPorSede {
  id: number;
  productoId: number;
  sedeId: number;
  stockDisponible?: number;
  stockMinimo?: number;
  stockMaximo?: number;
  cantidadActual: number;
  stockMinimoSede: number;
  ubicacionFisica?: string;
  producto?: Producto;
  sede?: Sede;
}

export interface TrasladoSede {
  id: number;
  productoId: number;
  sedeOrigenId: number;
  sedeDestinoId: number;
  cantidad: number;
  usuarioEnviaId: number;
  usuarioConfirmaId?: number;
  observacionEnvio?: string;
  observacionRecepcion?: string;
  estado: 'EN_TRANSITO' | 'RECIBIDO' | 'OBSERVADO';
  fechaEnvio: string;
  fechaConfirmacion?: string;
  producto?: Producto;
  sedeOrigen?: Sede;
  sedeDestino?: Sede;
}

export interface AlertaStock {
  id: number;
  productoId: number;
  stockDetectado: number;
  stockMinimo: number;
  estado: 'PENDIENTE' | 'ATENDIDA';
  fechaAlerta: string;
  producto?: Producto;
}

export interface OrdenServicio {
  id?: number;
  clienteNombre: string;
  clienteTelefono: string;
  equipoDispositivo: string;
  fallaReportada: string;
  montoServicio: number;
  estado: 'Por reparar' | 'Reparando' | 'Reparado';
}

export interface RegistroKardex {
  id: number;
  productoId: number;
  productoSKU: string;
  productoNombre: string;
  sedeId: number;
  sedeNombre: string;
  fecha: string;
  tipoOperacion: 'SALDO INICIAL' | 'ENTRADA COMPRA' | 'SALIDA VENTA' | 'TRASLADO';
  documentoReferencia: string;
  cantidadEntrada: number;
  costoUnitarioEntrada: number;
  totalEntrada: number;
  cantidadSalida: number;
  costoUnitarioSalida: number;
  totalSalida: number;
  saldoCantidad: number;
  saldoCostoUnitario: number;
  saldoTotal: number;
}