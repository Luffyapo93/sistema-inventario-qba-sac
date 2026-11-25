using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySistem.Data;
using MySistem.Models;

namespace MySistem.Controllers
{
    [ApiController]
    [Route("api/productos")]
    public class ProductosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. LISTAR PRODUCTOS (Formato Lista de Productos)
        [HttpGet]
        public async Task<IActionResult> GetProductos()
        {
            var lista = await _context.Productos
                .Include(p => p.Almacen)
                .Where(p => p.Estado)
                .OrderBy(p => p.Id)
                .ToListAsync();
            return Ok(lista);
        }

        // 2. CREAR NUEVO PRODUCTO (Admin)
        [HttpPost]
        public async Task<IActionResult> CrearProducto([FromBody] Producto nuevo)
        {
            if (await _context.Productos.AnyAsync(p => p.Id == nuevo.Id))
                nuevo.Id = (await _context.Productos.MaxAsync(p => (int?)p.Id) ?? 26940) + 1;

            nuevo.FechaActualizacion = DateTime.Now;
            nuevo.Estado = true;
            _context.Productos.Add(nuevo);
            await _context.SaveChangesAsync();
            return Ok(nuevo);
        }

        // 3. MODIFICAR PRODUCTO (Admin)
        [HttpPut("{id:int}")]
        public async Task<IActionResult> ActualizarProducto(int id, [FromBody] Producto editado)
        {
            var prod = await _context.Productos.FindAsync(id);
            if (prod == null) return NotFound();

            prod.CodigoSKU = editado.CodigoSKU;
            prod.IdAlmacen = editado.IdAlmacen;
            prod.AreaNombre = editado.AreaNombre;
            prod.Nombre = editado.Nombre;
            prod.Unidad = editado.Unidad;
            prod.PrecioCosto = editado.PrecioCosto;
            prod.PrecioVenta = editado.PrecioVenta;
            prod.StockActual = editado.StockActual;
            prod.StockMinimo = editado.StockMinimo;
            prod.FechaActualizacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(prod);
        }

        // 4. ELIMINAR PRODUCTO (Admin)
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> EliminarProducto(int id)
        {
            var prod = await _context.Productos.FindAsync(id);
            if (prod == null) return NotFound();

            prod.Estado = false;
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Producto eliminado correctamente" });
        }

        // 5. GESTIÓN DE USUARIOS (Solo Admin)
        [HttpGet("usuarios")]
        public async Task<IActionResult> GetUsuarios()
        {
            var usuarios = await _context.Usuarios
                .Include(u => u.Rol)
                .Include(u => u.Sede)
                .OrderBy(u => u.Id)
                .ToListAsync();
            return Ok(usuarios);
        }

        [HttpPost("usuarios")]
        public async Task<IActionResult> CrearUsuario([FromBody] Usuario nuevoUsuario)
        {
            if (await _context.Usuarios.AnyAsync(u => u.Username == nuevoUsuario.Username))
                return BadRequest(new { mensaje = "El nombre de usuario ya existe." });

            nuevoUsuario.FechaCreacion = DateTime.Now;
            nuevoUsuario.Estado = true;
            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();
            return Ok(nuevoUsuario);
        }

        // 6. TRASPASOS ENTRE SEDES (Envío por Admin/Almacenero y Confirmación por Vendedor)
        [HttpGet("traslados")]
        public async Task<IActionResult> GetTraslados()
        {
            var traslados = await _context.TrasladosSedes
                .Include(t => t.Producto)
                .Include(t => t.SedeOrigen)
                .Include(t => t.SedeDestino)
                .Include(t => t.UsuarioEnvia)
                .Include(t => t.UsuarioConfirma)
                .OrderByDescending(t => t.Id)
                .ToListAsync();
            return Ok(traslados);
        }

        [HttpPost("traslados/enviar")]
        public async Task<IActionResult> EnviarTraslado([FromBody] TrasladoSede envio)
        {
            var prod = await _context.Productos.FindAsync(envio.ProductoId);
            if (prod == null) return NotFound(new { mensaje = "Producto no encontrado." });
            if (prod.StockActual < envio.Cantidad)
                return BadRequest(new { mensaje = $"Stock insuficiente. Disponible: {prod.StockActual}" });

            // Descuenta stock en origen y deja el traspaso EN_TRANSITO esperando confirmación
            prod.StockActual -= envio.Cantidad;
            envio.Estado = "EN_TRANSITO";
            envio.FechaEnvio = DateTime.Now;

            _context.TrasladosSedes.Add(envio);

            // Evaluar alerta de stock mínimo
            if (prod.StockActual <= prod.StockMinimo)
            {
                _context.AlertasStock.Add(new AlertaStock
                {
                    ProductoId = prod.Id,
                    StockDetectado = prod.StockActual,
                    StockMinimo = prod.StockMinimo,
                    Estado = "PENDIENTE"
                });
            }

            await _context.SaveChangesAsync();
            return Ok(envio);
        }

        [HttpPut("traslados/confirmar/{id:int}")]
        public async Task<IActionResult> ConfirmarRecepcionTraslado(int id, [FromBody] ConfirmacionDto dto)
        {
            var traslado = await _context.TrasladosSedes.FindAsync(id);
            if (traslado == null) return NotFound();

            traslado.Estado = "RECIBIDO";
            traslado.UsuarioConfirmaId = dto.UsuarioConfirmaId;
            traslado.ObservacionRecepcion = dto.ObservacionRecepcion ?? "Mercadería recibida conforme";
            traslado.FechaConfirmacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(traslado);
        }
    }

    public class ConfirmacionDto
    {
        public int UsuarioConfirmaId { get; set; }
        public string? ObservacionRecepcion { get; set; }
    }
}