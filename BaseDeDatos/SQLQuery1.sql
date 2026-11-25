USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = N'QBA_InventarioDB')
BEGIN
    ALTER DATABASE QBA_InventarioDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE QBA_InventarioDB;
END
GO

CREATE DATABASE QBA_InventarioDB;
GO

USE QBA_InventarioDB;
GO

-- ============================================================================
-- 1. TABLA SEDES / ALMACENES (Con el ID Almacén 93 de tu Excel y las tiendas)
-- ============================================================================
CREATE TABLE Sedes (
    Id INT PRIMARY KEY, -- Usamos IDs reales como 93 para Almacén Central
    Nombre NVARCHAR(100) NOT NULL,
    Direccion NVARCHAR(200) NULL,
    Telefono NVARCHAR(20) NULL,
    Estado BIT NOT NULL DEFAULT 1
);

INSERT INTO Sedes (Id, Nombre, Direccion, Telefono) VALUES
(93, 'Almacén Corporativo (#93)', 'Av. Principal 123 - Central', '987654321'),
(94, 'Tienda Full Tecnología', 'C.C. CyberPlaza Tda. 104', '987654322'),
(95, 'Tienda Dahua Cámaras', 'C.C. Electrónica Tda. 208', '987654323');
GO

-- ============================================================================
-- 2. TABLA ROLES Y USUARIOS (Para el módulo de creación de usuarios del Admin)
-- ============================================================================
CREATE TABLE Roles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Codigo NVARCHAR(30) NOT NULL UNIQUE,
    Nombre NVARCHAR(80) NOT NULL,
    Descripcion NVARCHAR(200) NULL
);

INSERT INTO Roles (Codigo, Nombre, Descripcion) VALUES
('Administrador', 'Administrador del Sistema', 'Control total, creación de usuarios, productos y traspasos'),
('Almacenero', 'Jefe / Asistente de Almacén', 'Control de stock, entradas y despacho de traspasos entre sedes'),
('Vendedor', 'Vendedor Punto de Venta', 'Ventas en tienda, consulta de stock y confirmación de recepción de traspasos'),
('Compras', 'Responsable de Compras', 'Atención de alertas de stock mínimo y emisión de órdenes de compra'),
('Gerencia', 'Gerencia / Contabilidad', 'Consulta de Kardex valorizado, reportes e indicadores');
GO

CREATE TABLE Usuarios (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RolId INT NOT NULL FOREIGN KEY REFERENCES Roles(Id),
    SedeId INT NOT NULL FOREIGN KEY REFERENCES Sedes(Id),
    NombreCompleto NVARCHAR(150) NOT NULL,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Correo NVARCHAR(100) NULL,
    TelefonoWhatsApp NVARCHAR(20) NULL,
    Estado BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

INSERT INTO Usuarios (RolId, SedeId, NombreCompleto, Username, PasswordHash, Correo, TelefonoWhatsApp) VALUES
(1, 93, 'Carlos Mendoza', 'admin', '123456', 'admin@qbasac.pe', '+51987654321'),
(2, 93, 'Roberto Vargas', 'almacenero', '123456', 'almacen@qbasac.pe', '+51987654322'),
(3, 94, 'Ana Torres', 'vendedor', '123456', 'fulltec@qbasac.pe', '+51987654323'),
(3, 95, 'Luis Paredes', 'vendedor_dahua', '123456', 'dahua@qbasac.pe', '+51987654324'),
(4, 93, 'Elena Quispe', 'compras', '123456', 'compras@qbasac.pe', '+51987654325'),
(5, 93, 'Jorge Salazar', 'gerencia', '123456', 'gerencia@qbasac.pe', '+51987654326');
GO

-- ============================================================================
-- 3. TABLA PRODUCTOS (Estructura exacta de tu Excel "Lista de Productos")
-- ============================================================================
CREATE TABLE Productos (
    Id INT PRIMARY KEY, -- Mantiene tus IDs reales (26929, 26930, etc.)
    CodigoSKU NVARCHAR(50) NOT NULL UNIQUE, -- Columna CÓDIGO
    IdAlmacen INT NOT NULL FOREIGN KEY REFERENCES Sedes(Id), -- Columna ID Almacén (93)
    AreaNombre NVARCHAR(100) NOT NULL, -- Full Tecnología / Dahua Cámaras / Almacén Central
    Nombre NVARCHAR(250) NOT NULL, -- Columna Producto/Servicio
    Unidad NVARCHAR(30) NOT NULL DEFAULT 'UNIDADES', -- Columna Unidad
    PrecioCosto DECIMAL(12,2) NOT NULL DEFAULT 0, -- Columna Costo (S/)
    PrecioVenta DECIMAL(12,2) NOT NULL DEFAULT 0, -- Columna Precio Venta (S/)
    StockActual INT NOT NULL DEFAULT 0, -- Columna Stock
    StockMinimo INT NOT NULL DEFAULT 3, -- Umbral de alerta automática
    Estado BIT NOT NULL DEFAULT 1,
    FechaActualizacion DATETIME NOT NULL DEFAULT GETDATE()
);

INSERT INTO Productos (Id, CodigoSKU, IdAlmacen, AreaNombre, Nombre, Unidad, PrecioCosto, PrecioVenta, StockActual, StockMinimo) VALUES
(26929, 'GQY1JAY', 93, 'Full Tecnología', 'SOFTWARE ESET NOD32 INTERNET SECURITY 1PC 3 AÑOS', 'UNIDADES', 30.00, 50.00, 8, 3),
(26930, '50036382441', 93, 'Full Tecnología', 'HEADPHONE JBL HARMAN TRULY WIRELESS IVARY WAVE100', 'UNIDADES', 136.04, 170.00, 2, 3),
(26933, '6923170000000', 93, 'Dahua Cámaras', 'TECLADO CONTROLADOR IP CON JOYSTICK DAHUA DHI-NKB1000', 'UNIDADES', 671.56, 910.00, 1, 3),
(26934, '6939550000000', 93, 'Dahua Cámaras', 'FUENTE DE PODER CENTRALIZADA DAHUA DH-PFM341-9CH', 'UNIDADES', 152.75, 195.00, 5, 3),
(26936, 'JI2K7M3', 93, 'Almacén Central', 'CANALETA C/ADESIVO SATRA 24*14 BLANCO', 'UNIDADES', 3.39, 6.00, 25, 5),
(26937, '4IKF7I8', 93, 'Almacén Central', 'CANALETA C/ADESIVO SATRA 15*10 BLANCO', 'UNIDADES', 2.11, 4.00, 18, 5),
(26939, 'H1W6MDM', 93, 'Dahua Cámaras', 'TRANSFORMADOR TRA-2A60 AC220V', 'UNIDADES', 23.52, 35.00, 3, 3),
(26940, 'HRJFET3', 93, 'Full Tecnología', 'TECLADO INALAMBRICO PARADOX K1', 'UNIDADES', 119.02, 150.00, 4, 3),
(26941, 'ZG8PRQW', 93, 'Dahua Cámaras', 'KIT SPECTRA SP4000-K-2NV5 SP4000', 'UNIDADES', 237.53, 300.00, 0, 3),
(26942, 'DFLKMOL', 93, 'Dahua Cámaras', 'SENSOR DE MOVIMIENTO NV5 CABLEADO PARADOX', 'UNIDADES', 31.80, 45.00, 6, 3),
(26943, 'KUBCEUS', 93, 'Dahua Cámaras', 'CONTACTO MAGNETICO PLASTICO BS-2033BN', 'UNIDADES', 3.37, 5.00, 12, 4);
GO

-- ============================================================================
-- 4. TABLA TRASPASOS ENTRE SEDES (Flujo 2 Fases: Envío -> Confirmación Recepción)
-- ============================================================================
CREATE TABLE TrasladosSedes (
    Id INT IDENTITY(101,1) PRIMARY KEY,
    ProductoId INT NOT NULL FOREIGN KEY REFERENCES Productos(Id),
    SedeOrigenId INT NOT NULL FOREIGN KEY REFERENCES Sedes(Id),
    SedeDestinoId INT NOT NULL FOREIGN KEY REFERENCES Sedes(Id),
    Cantidad INT NOT NULL,
    UsuarioEnviaId INT NOT NULL FOREIGN KEY REFERENCES Usuarios(Id), -- Solo Admin o Almacenero
    UsuarioConfirmaId INT NULL FOREIGN KEY REFERENCES Usuarios(Id), -- Usuario en tienda destino
    ObservacionEnvio NVARCHAR(250) NULL,
    ObservacionRecepcion NVARCHAR(250) NULL,
    Estado NVARCHAR(25) NOT NULL DEFAULT 'EN_TRANSITO', -- 'EN_TRANSITO' | 'RECIBIDO' | 'OBSERVADO'
    FechaEnvio DATETIME NOT NULL DEFAULT GETDATE(),
    FechaConfirmacion DATETIME NULL
);

-- Traspasos iniciales de prueba
INSERT INTO TrasladosSedes (ProductoId, SedeOrigenId, SedeDestinoId, Cantidad, UsuarioEnviaId, ObservacionEnvio, Estado) VALUES
(26934, 93, 95, 2, 2, 'Reposición urgente para vitrina Tienda Dahua', 'EN_TRANSITO'),
(26929, 93, 94, 3, 1, 'Stock licencias ESET para campaña Full Tecnología', 'EN_TRANSITO');
GO

-- ============================================================================
-- 5. TABLA ALERTAS DE STOCK MÍNIMO Y KARDEX VALORIZADO
-- ============================================================================
CREATE TABLE AlertasStock (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductoId INT NOT NULL FOREIGN KEY REFERENCES Productos(Id),
    StockDetectado INT NOT NULL,
    StockMinimo INT NOT NULL,
    Estado NVARCHAR(20) NOT NULL DEFAULT 'PENDIENTE', -- 'PENDIENTE' | 'ATENDIDA'
    FechaAlerta DATETIME NOT NULL DEFAULT GETDATE(),
    FechaAtencion DATETIME NULL
);

INSERT INTO AlertasStock (ProductoId, StockDetectado, StockMinimo, Estado) VALUES
(26930, 2, 3, 'PENDIENTE'),
(26933, 1, 3, 'PENDIENTE'),
(26939, 3, 3, 'PENDIENTE'),
(26941, 0, 3, 'PENDIENTE');
GO

CREATE TABLE Kardex (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductoId INT NOT NULL FOREIGN KEY REFERENCES Productos(Id),
    SedeId INT NOT NULL FOREIGN KEY REFERENCES Sedes(Id),
    TipoMovimiento NVARCHAR(30) NOT NULL, -- 'ENTRADA' | 'SALIDA_VENTA' | 'TRASPASO_SALIDA' | 'TRASPASO_ENTRADA'
    DocumentoRef NVARCHAR(50) NULL,
    Cantidad INT NOT NULL,
    CostoUnitario DECIMAL(12,2) NOT NULL,
    SaldoResultante INT NOT NULL,
    UsuarioResponsable NVARCHAR(100) NOT NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
);
GO