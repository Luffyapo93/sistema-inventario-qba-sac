using Microsoft.EntityFrameworkCore;
using MySistem.Models;

namespace MySistem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Sede> Sedes { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<TrasladoSede> TrasladosSedes { get; set; }
        public DbSet<AlertaStock> AlertasStock { get; set; }
        public DbSet<Kardex> Kardex { get; set; }
    }
}