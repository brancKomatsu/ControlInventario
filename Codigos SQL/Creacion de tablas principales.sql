create table lac (
id_lac int identity(1,1) primary key,
nombre_lac varchar(10)
)

create table ubicaciones (
id_ubicacion int identity(1,1) primary key,
nombre_ubicacion varchar(50) not null
)

create table usuarios_app (
id_usuario int identity(1,1) primary key,
correo_electronico varchar(50),
contrasena varchar(20)
)

create table estado (
id_estado int identity(1,1) primary key,
nombre_status varchar(20)
)

create table empleados (
rut varchar(15) primary key not null,
nombre varchar(20),
apellido varchar(20),
lac int,
correo_electronico varchar(50),
estado int,
foreign key (estado) references estado(id_estado),
foreign key (lac) references lac(id_lac)
)

create table movimientos (
asset int primary key not null,
rut_persona varchar(15),
ultima_modificacion date,
ubicacion int,
estado int,
alias varchar(10),
foreign key (rut_persona) references empleados(rut),
foreign key (ubicacion) references ubicaciones(id_ubicacion),
foreign key (estado) references estado(id_estado)
)

create table historial_usuarios (
id_historial_usuario int identity(1,1) primary key,
asset_equipo int not null,
rut_persona varchar(15),
fecha_ingreso date,
fecha_eliminaicion date
foreign key (asset_equipo) references movimientos(asset),
foreign key (rut_persona) references empleados(rut)
)

create table historial_mantenimiento (
id_historial_mantenimiento int identity(1,1) primary key,
asset_equipo int not null,
fecha_ingreso date,
fecha_eliminacion date,
causa text,
foreign key (asset_equipo) references movimientos(asset)
)

create table categorias (
id_categoria int identity(1,1) primary key,
nombre_tabla varchar(30)
)

create table equipos (
service_tag varchar(10) primary key,
categoria int not null,
asset_equipo int not null,
creacion_equipo date not null,
eliminacion_equipo date,
documento_firmado varchar(2),
lac int,
foreign key (lac) references lac(id_lac),
foreign key (categoria) references categorias(id_categoria),
foreign key (asset_equipo) references movimientos(asset)
)


