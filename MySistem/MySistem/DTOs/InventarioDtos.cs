namespace MySistem.DTOs
{
    public class RegistrarSalidaDto
    {
        public int ProductoId { get; set; }
        public int SedeId { get; set; }
        public int Cantidad { get; set; }
        public int UsuarioId { get; set; } = 1;
        public string? NumeroDocumento { get; set; }
    }

    public class RegistrarEntradaDto
    {
        public int ProductoId { get; set; }
        public int SedeId { get; set; }
        public int Cantidad { get; set; }
        public decimal CostoUnitario { get; set; }
        public int UsuarioId { get; set; } = 1;
        public string? NumeroDocumento { get; set; }
    }

    public class ConfigurarStockDto
    {
        public int ProductoId { get; set; }
        public int SedeId { get; set; }
        public int StockMinimo { get; set; }
        public int StockMaximo { get; set; }
    }

    public class ResultadoOperacionDto
    {
        public bool Exito { get; set; }
        public string Mensaje { get; set; } = string.Empty;
        public int StockRestante { get; set; }
        public bool AlertaDisparada { get; set; }
        public int? AlertaId { get; set; }
    }
}