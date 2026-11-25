using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MySistem.Models
{
    [Table("Sedes")]
    public class Sede
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        [Required, StringLength(100)]
        public string Nombre { get; set; } = string.Empty;
        public string? Direccion { get; set; }
        public string? Telefono { get; set; }
        public bool Estado { get; set; } = true;
    }

    [Table("Roles")]
    public class Rol
    {
        [Key]
        public int Id { get; set; }
        [Required, StringLength(30)]
        public string Codigo { get; set; } = string.Empty;
        [Required, StringLength(80)]
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
    }

    [Table("Usuarios")]
    public class Usuario
    {
        [Key]
        public int Id { get; set; }
        public int RolId { get; set; }
        public int SedeId { get; set; }
        [Required, StringLength(150)]
        public string NombreCompleto { get; set; } = string.Empty;
        [Required, StringLength(50)]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        public string? Correo { get; set; }
        public string? TelefonoWhatsApp { get; set; }
        public bool Estado { get; set; } = true;
        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        [ForeignKey("RolId")]
        public virtual Rol? Rol { get; set; }
        [ForeignKey("SedeId")]
        public virtual Sede? Sede { get; set; }
    }

    [Table("Productos")]
    public class Producto
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        [Required, StringLength(50)]
        public string CodigoSKU { get; set; } = string.Empty;
        public int IdAlmacen { get; set; } = 93;
        [Required, StringLength(100)]
        public string AreaNombre { get; set; } = "Full Tecnología";
        [Required, StringLength(250)]
        public string Nombre { get; set; } = string.Empty;
        [Required, StringLength(30)]
        public string Unidad { get; set; } = "UNIDADES";
        [Column(TypeName = "decimal(12,2)")]
        public decimal PrecioCosto { get; set; }
        [Column(TypeName = "decimal(12,2)")]
        public decimal PrecioVenta { get; set; }
        public int StockActual { get; set; }
        public int StockMinimo { get; set; } = 3;
        public bool Estado { get; set; } = true;
        public DateTime FechaActualizacion { get; set; } = DateTime.Now;

        [ForeignKey("IdAlmacen")]
        public virtual Sede? Almacen { get; set; }
    }

    [Table("TrasladosSedes")]
    public class TrasladoSede
    {
        [Key]
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public int SedeOrigenId { get; set; }
        public int SedeDestinoId { get; set; }
        public int Cantidad { get; set; }
        public int UsuarioEnviaId { get; set; }
        public int? UsuarioConfirmaId { get; set; }
        public string? ObservacionEnvio { get; set; }
        public string? ObservacionRecepcion { get; set; }
        [StringLength(25)]
        public string Estado { get; set; } = "EN_TRANSITO";
        public DateTime FechaEnvio { get; set; } = DateTime.Now;
        public DateTime? FechaConfirmacion { get; set; }

        [ForeignKey("ProductoId")]
        public virtual Producto? Producto { get; set; }
        [ForeignKey("SedeOrigenId")]
        public virtual Sede? SedeOrigen { get; set; }
        [ForeignKey("SedeDestinoId")]
        public virtual Sede? SedeDestino { get; set; }
        [ForeignKey("UsuarioEnviaId")]
        public virtual Usuario? UsuarioEnvia { get; set; }
        [ForeignKey("UsuarioConfirmaId")]
        public virtual Usuario? UsuarioConfirma { get; set; }
    }

    [Table("AlertasStock")]
    public class AlertaStock
    {
        [Key]
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public int StockDetectado { get; set; }
        public int StockMinimo { get; set; }
        public string Estado { get; set; } = "PENDIENTE";
        public DateTime FechaAlerta { get; set; } = DateTime.Now;
        public DateTime? FechaAtencion { get; set; }

        [ForeignKey("ProductoId")]
        public virtual Producto? Producto { get; set; }
    }

    [Table("Kardex")]
    public class Kardex
    {
        [Key]
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public int SedeId { get; set; }
        public string TipoMovimiento { get; set; } = string.Empty;
        public string? DocumentoRef { get; set; }
        public int Cantidad { get; set; }
        [Column(TypeName = "decimal(12,2)")]
        public decimal CostoUnitario { get; set; }
        public int SaldoResultante { get; set; }
        public string UsuarioResponsable { get; set; } = string.Empty;
        public DateTime FechaRegistro { get; set; } = DateTime.Now;

        [ForeignKey("ProductoId")]
        public virtual Producto? Producto { get; set; }
    }
}