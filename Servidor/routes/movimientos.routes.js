import { Router } from 'express'
import { getConnection } from '../database/connection.js'
import sql from 'mssql'
import dayjs from 'dayjs'

const router = Router()
//<-------------- verEquipos ----------------->
router.get('/verEquipos', async (req, res) => {
	const pool = await getConnection()

    const resultado = await pool.request().query('select * from Informacion_equipos')
    console.log(resultado.recordset)

	res.json(resultado.recordset)
})
//--> Nombre categorias
router.get("/categorias", async (req, res) => {
    const pool = await getConnection()
    try {
        const respuesta = await pool.request().query('select nombre_tabla from categorias')
        console.log(respuesta.recordset)
        res.send(respuesta.recordset)
    } catch (error) {
        console.error("No se pudo conseguir los nombres de las categorias")
    }
})
//--> Informacion Categoria
router.get("/tablaCategorias/:categoria", async (req, res) => {
    const pool = await getConnection()
    const categoria = req.params.categoria
    console.log(categoria)
    
    try {
        const respuesta = await pool.request()
            .input('categoria', sql.VarChar, categoria)
            .query(`select t1.*, t2.* from tabla_Categoria as t1 join ${categoria} as t2 on t1.service_tag=t2.id_service_tag where t1.tabla=@categoria`)
        console.log(respuesta.recordset)
        res.send(respuesta.recordset)
    } catch (error) {
        console.error("No se pudo conseguir la tabla de la categoria", error)
    }
})

//<-------------- Registro ------------------->
router.post("/Registro", async (req, res) => {
    const pool = await getConnection()
    const { correo, contrasena } = req.body

    const consulta = await pool.request()
        .input('correo', sql.VarChar, correo)
        .query('select correo_electronico from usuarios_app where correo_electronico=@correo')

    if (consulta.recordset.length !== 0) {

        res.json(null)

    } else {

        const resultado = await pool.request()
            .input('correo', sql.VarChar, correo)
            .input('contrasena', sql.VarChar, contrasena)
            .query('insert into usuarios_app values (@correo, @contrasena)')

        res.json(resultado.recordset)

    }
})

//<-------------- Login ---------------------->
router.post("/Login", async (req, res) => {
    const pool = await getConnection()
    const { correo, contrasena } = req.body

    try {
        const resultado = await pool.request()
            .input('correo', sql.VarChar, correo)
            .input('contrasena', sql.VarChar, contrasena)
            .query(
                'select correo_electronico, contrasena from usuarios_app where correo_electronico=@correo and contrasena=@contrasena'
            )

        console.log(resultado.recordset)
        res.json(resultado.recordset)
    } catch (e) {
        console.error("Hubo error en la peticion", e)
    }
})


//<-------------- Empleados ------------------>
router.get('/datosEmpleados', async (req, res) => {
    const pool = await getConnection()
    const info = await pool.request().query('select * from Informacion_empleados')
    //console.log(info)
    res.json(info.recordset)
})
//--> Columnas Empleados
router.get('/columnasEmpleados', async (req, res) => {
    const pool = await getConnection()
    const respuesta = await pool.request().query('select * from Columnas_empleados')
    console.log(respuesta.recordset)
    res.json(respuesta.recordset)
})
//--> Crear Empleado
router.post('/crearEmpleado', async (req, res) => {
    const pool = await getConnection()
    const info = req.body
    const valores = await Promise.all(
        Object.entries(info).map( async ([key, value]) => {
            if ( key === "nombre" || key === "apellido" || key === "lac") {
                value = value.toUpperCase()
            }
            if (key === "lac") {
                const id_lac = await pool.request().query(`select id_lac from lac where nombre_lac = '${value}'`)
                return id_lac.recordset[0].id_lac
            }
            return ( 
                `'${value} '`
            )
        })
    )
    const valoresString = valores.join(', ')
    console.log("El empleado a agregar es el siguiente: ", valores)

    const columnas = Object.entries(info).map(([key, value]) => {
        return (
            `[${key}]`
        )
    }).join(', ')
    console.log("Las columnas son: ", columnas)
    try {
        const respuesta = await pool.request().query(`insert into empleados (${columnas}, estado) values (${valoresString}, 5)`)
        console.log("Se ha enviado la informacion: ", respuesta)
        res.send()
    } catch (error) {
        console.error("Hubo un error al enviar la informacion a la base de datos", error)
    }
})
//--> Empleado unico
router.get("/EmpleadoUnico/:asset", async (req, res) => {
    const pool = await getConnection()
    const info = req.params.asset
    console.log(info)
    
    try {
        const respuesta = await pool.request()
            .input('rut', sql.VarChar, info)
            .query('select * from Informacion_empleados where rut=@rut')
        res.send(respuesta.recordset)
    } catch (error) {
        console.error("Hubo un error en la obtencion de los datos de un empleado", error)
    }
})
//--> Eliminar Empleado
router.post("/eliminarEmpleado", async (req, res) => {
    const pool = await getConnection()
    const rut = req.body
    const fecha = dayjs().format('YYYY-MM-DD')
    console.log(rut.rut)

    const movimientos = await pool.request()
        .input('rut', sql.VarChar, rut.rut)
        .query('select * from movimientos where rut_persona=@rut')
    console.log(movimientos.recordset)

    if (movimientos.recordset.length !== 0) {
        try {
            const respuesta = await pool.request()
                .input('rut', sql.VarChar, rut.rut)
                .input('fecha', sql.Date, fecha)
                .query(`update movimientos set rut_persona='0', ultima_modificacion=@fecha, estado=2, ubicacion=9, alias='' where rut_persona=@rut`)
            console.log(respuesta)
        } catch (error) {
            console.error("Hubo un error en la actualizacion de movimientos", error)
        }
    }
    
    try {
        const respuesta = await pool.request()
            .input('rut', sql.VarChar, rut.rut)
            .query('update empleados set estado=3 where rut=@rut')
        res.send(respuesta)
    } catch (error) {
        console.error("Hubo un error en la eliminacion del empleado", error)
    }
})
//--> Modificar Empleado
router.post("/modificarEmpleado", async (req, res) => {
    const pool = await getConnection()
    const info = req.body
    const lac = await pool.request()
        .input('lac', sql.VarChar, info.lac)
        .query('select id_lac from lac where nombre_lac=@lac')
    console.log(lac.recordset[0].id_lac)
    try {
        const respuesta = await pool.request()
            .input('rut', sql.VarChar,info.rut)
            .input('nombre', sql.VarChar, info.nombre)
            .input('apellido', sql.VarChar, info.apellido)
            .input('lac', sql.Int, lac.recordset[0].id_lac)
            .input('correo', sql.VarChar, info.correo_electronico)
            .query(`update empleados set rut=@rut, nombre=@nombre, apellido=@apellido, lac=@lac, correo_electronico=@correo, estado=5 where rut=@rut`)
        res.send(respuesta)
    } catch (error) {
        console.error("No se pudo modificar el empleado", error)
    }
})


//--------------- CreacionEquipos ----------->
router.get("/CreacionEquipo", async (req, res) => {
    const pool = await getConnection()
    const resultado = await pool.request().query("select fk.TABLE_NAME from information_schema.key_column_usage fk join information_schema.referential_constraints rc on fk.constraint_name=rc.constraint_name join INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc on rc.UNIQUE_CONSTRAINT_NAME = tc.CONSTRAINT_NAME where tc.TABLE_NAME = 'equipos' and fk.table_name != 'categorias'")
    console.log("nombre de las tablas son: ",  resultado.recordset)
    res.json(resultado.recordset)
})
//--> Crear tabla
router.post('/subirTabla', async (req, res) => {
    const pool = await getConnection()
    const info = req.body
    console.log(info)
    const nombre_tabla = info.nombre_tabla
    const query = info.columnas.map(dato => `[${dato.nombre}] ${dato.tipo}`).join(", ")
    console.log(query)

    try {
        const categoria = await pool.request()
            .query(`insert into categorias (nombre_tabla) values('${nombre_tabla}')`)
        console.log("categoria creada", categoria)
    } catch (error) {
        console.error("Hubo error al crear categoria", error)
    }

    try {
        const nuevaTabla = await pool.request()
            .query(`create table ${nombre_tabla} (id_service_tag varChar(10), ${query}, foreign key (id_service_tag) references equipos(service_tag))`)
        console.log("nueva tabla creada", nuevaTabla)
    } catch (error) {
        console.error("Hubo error al crear tabla", error)
    }
})
//--> Subir Equipo
router.post("/subirEquipo", async (req, res) => {
    const pool = await getConnection()
    const info = req.body
    const asset = info.asset
    const service = info.service
    const nombre_tabla = info.nombre_tabla
    const lac = info.lac
    const nombre_columnas = info.valores.map(item => `[${Object.keys(item)[0]}]`).join(',')
    const valores = info.valores.map(item => `'${Object.values(item)[0]}'`).join(',')
    const fecha = info.fecha_creacion 
    console.log(info,nombre_tabla, asset, service, nombre_columnas, valores, lac)

    //crear el dato en tabla movimientos
    try {
        const movimientos = await pool.request()
            .input('asset', sql.Int, asset)
            .input('fecha', sql.Date, fecha)
            .query(`insert into movimientos (asset, rut_persona, ultima_modificacion, ubicacion, estado) values (@asset, 0, @fecha, 9, 2)`)
        console.log("movimientos: ", movimientos)
    } catch (error) {
        console.error("Hubo un error en la insercion de datos de la primary key", error)
        res.send("asset ya existe")
        return
    }

    //crear dato en tabla equipo
    try {
        const id_lac = await pool.request().query(`select id_lac from lac where nombre_lac = '${lac}'`)
        console.log("El id del lac es: ", id_lac.recordset[0].id_lac)

        const equipos = await pool.request()
            .input('service', sql.VarChar, service)
            .input('lac', sql.Int, id_lac.recordset[0].id_lac)
            .input('asset', sql.Int, asset)
            .input('fecha', sql.Date, fecha)
            .input('nombre_tabla', sql.VarChar, nombre_tabla)
            .query(`insert into equipos (service_tag, categoria, asset_equipo, creacion_equipo, lac) values (@service, (select id_categoria from categorias where nombre_tabla=@nombre_tabla) , @asset, @fecha, @lac)`)
        console.log("equipos: ", equipos)
    } catch (error) {
        console.error("Hubo un error en la insercion de datos en equipos")

        const equipos = await pool.request()
            .input('asset', sql.Int, asset)
            .query('delete from movimientos where asset=@asset')

        res.send("service_tag ya existe")
        return
    }

    //crear dato en tabla de las caracteristicas
    try {
        const tabla = await pool.request()
            .input('service', sql.VarChar, service)
            .query(`insert into ${nombre_tabla} (${nombre_columnas}, id_service_tag) values (${valores}, @service)`)
        console.log("tabla: ", tabla)
        res.send(tabla)
    } catch (error) {
        console.error("Hubo un error en la insercion de datos en la categoria correspondiente", error)
        await pool.request().input('asset', sql.Int, asset).query(`delete from equipos where asset_equipo=@asset`)
        await pool.request().input('asset', sql.Int, asset).query(`delete from movimientos where asset=@asset`)
        res.send("Hubo error en la insercion de los datos")
    }
    
})
//infoEquipo
router.get("/infoEquipo", async (req, res) => {
    const pool = await getConnection()
    const nombreTabla = req.query.tabla
    console.log(nombreTabla)
    const resultado = await pool.request()
        .input('nombre', sql.VarChar, nombreTabla)
        .query(`select column_name from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME=@nombre and column_name != 'id_service_tag'`)

    console.log("nombre de las columnas son: ", resultado.recordset)
    res.json(resultado.recordset)
})


//<-------------- Equipos ------------------->
router.get("/Equipo/:asset", async (req,res) => {
    const pool = await getConnection()
    const asset = req.params.asset
    console.log("El asset a consultar es: ", asset)

    const nombre_tabla = await pool.request() 
        .input('asset', sql.Int, asset)
        .query('select nombre_tabla from categorias as c join equipos as e on c.id_categoria=e.categoria join movimientos as m on m.asset=e.asset_equipo where asset=@asset')
    //console.log("Nombre de la tabla: ", nombre_tabla.recordset[0].nombre_tabla)

    const caracteristicas = await pool.request()
        .input('asset', sql.Int, asset)
        .query(`select t1.* from ${nombre_tabla.recordset[0].nombre_tabla} as t1 join equipos on id_service_tag=service_tag where asset_equipo=@asset`)
    console.log("las caracteristicas son: ", caracteristicas.recordset)

    const general_info = await pool.request()
        .input('asset', sql.Int, asset)
        .query('select * from Informacion_general_equipo where asset=@asset')
    //console.log("La informacion general es: ", general_info)

    const respuesta_final = [nombre_tabla, caracteristicas, general_info]
    //console.log("respuesta final: ", respuesta_final)

    res.send(respuesta_final)
})
//--> columnas Caracteristicas
router.get("/Caracteristicas/:asset", async (req, res) => {
    const pool = await getConnection()
    const asset = req.params.asset
    console.log(asset)

    const nombre_tabla = await pool.request()
        .input('asset', sql.Int, asset)
        .query('select nombre_tabla from categorias as c join equipos as e on c.id_categoria=e.categoria join movimientos as m on m.asset=e.asset_equipo where asset=@asset')
    console.log("Nombre de la tabla: ", nombre_tabla.recordset[0].nombre_tabla)

    try {
        const respuesta = await pool.request()
            .input('asset', sql.Int, asset)
            .query(`select t1.* from ${nombre_tabla.recordset[0].nombre_tabla} as t1 join equipos as t2 on t1.id_service_tag=t2.service_tag where t2.asset_equipo=@asset`)
        console.log("los nombres de las columnas son: ", respuesta.recordset)

        res.send(respuesta.recordset[0])
    } catch (error) {
        console.error("Hubo un error con la obtencion de nombre de las columnas de tabla caracteristicas", error)
    }
})
//--> actualizarCaracteristicas
router.post("/actualizarCaracteristica", async (req, res) => {
    const pool = await getConnection()
    const info = req.body
    console.log(info)
    const asset = info.asset

    const nombre_tabla = await pool.request()
        .input('asset', sql.Int, asset)
        .query('select nombre_tabla from categorias as c join equipos as e on c.id_categoria=e.categoria join movimientos as m on m.asset=e.asset_equipo where asset=@asset')
    console.log("El nombre de la tabla es: ", nombre_tabla.recordset[0].nombre_tabla)
    const columna_tipo = await pool.request()
        .input('asset', sql.Int, asset)
        .query(`select column_name, data_type from information_schema.columns where table_name='${nombre_tabla.recordset[0].nombre_tabla}'`)
    console.log("Los tipos de datos de las columnas son: ", columna_tipo.recordset)
    const service_tag = await pool.request()
        .input('asset', sql.Int, asset)
        .query(`select id_service_tag from ${nombre_tabla.recordset[0].nombre_tabla} join equipos on equipos.service_tag=${nombre_tabla.recordset[0].nombre_tabla}.id_service_tag where equipos.asset_equipo=@asset`)
    const valores = Object.entries(info)
        .filter(([key]) => key !== "asset")
        .map(([key, values]) => {
            const tipo = columna_tipo.recordset.find(item => item.column_name === key)

            if (tipo.data_type === 'varchar' || tipo.data_type === 'date') {
                return `[${tipo.column_name}] = '${values}'`
            } else if (tipo.data_type === 'int') {
                return `[${tipo.column_name}] = ${parseInt(values, 10)}`
            } 
        }).join(', ')

    console.log(info)
    console.log("El asset es: ", asset)
    //console.log("Las columnas son: ", columnas)
    console.log("Los valores son: ", valores)

    try {
        const respuesta = await pool.request()
            .query(`update ${nombre_tabla.recordset[0].nombre_tabla} set ${valores} where id_service_tag=${service_tag.recordset[0].id_service_tag}`)
        console.log("Se ha actualizado correctamente", respuesta)
    } catch (error) {
        console.error("Hubo un error al actualizar la tabla", error)
    }



})
//--> NombreApellido usuarios
router.get("/nombreapellido", async (req, res) => {
    const pool = await getConnection()
    const info = await pool.request().query('select nombre, apellido, lac from empleados')
    console.log("Los nombres y apellidos de los usuarios a peticion son: ", info.recordset)
    res.send(info.recordset)
})
//--> actualizar usuario de equipo
router.post("/actualizarUsuario", async (req, res) => {
    const pool = await getConnection()
    const info = req.body
    const asset = parseInt(info.asset, 10)
    const fecha = dayjs().format('YYYY-MM-DD')


    const primerApellido = info.apellido.split(" ")[0]
    console.log(primerApellido)

    const rut_persona = await pool.request()
        .input('nombre', sql.VarChar, info.nombre)
        .input('apellido', sql.VarChar, info.apellido)
        .query('select rut from empleados where nombre=@nombre and apellido=@apellido')
    console.log("El rut de la persona es: ", rut_persona.recordset[0].rut)
    
    try {
        const movimientos = await pool.request()
            .input('rut', sql.VarChar, rut_persona.recordset[0].rut)
            .input('asset', sql.Int, asset)
            .input('fecha', sql.Date, fecha)
            .query(`update movimientos set rut_persona=@rut, ultima_modificacion=@fecha, estado=1, alias='CL-${primerApellido}' where asset=@asset`)
        console.log(movimientos)
    } catch (error) {
        console.error("Hubo un error al actualizar en tabla movimientos", error)
    }

    try {
        const historial = await pool.request()
            .input('rut', sql.VarChar, rut_persona.recordset[0].rut)
            .input('asset', sql.Int, asset)
            .input('fecha', sql.Date, fecha)
            .query('insert into historial_usuarios (asset_equipo, rut_persona, fecha_ingreso, fecha_eliminaicion) values (@asset, @rut, @fecha, null)')
        console.log(historial)
        res.send(historial)
    } catch (error) {
        console.error("Hubo un error al actualizar en tabla historial_usuarios", error)
    }
    
    console.log(info)
})
//--> crear mantenimiento
router.post("/crearMantenimiento", async (req, res) => {
    const pool = await getConnection()
    const info = req.body 
    const asset = parseInt(info.asset, 10)
    const fecha = dayjs().format('YYYY-MM-DD')
    console.log(info, asset)

    try {
        const respuesta = await pool.request()
            .input('asset', sql.Int, asset)
            .input('fecha', sql.Date, fecha)
            .query('update movimientos set ultima_modificacion=@fecha, estado=4, ubicacion=9 where asset=@asset')
        console.log(respuesta)
    } catch (error) {
        console.error("Hubo un error en la actualizacion de tabla movimientos", error)
    }

    try {
        const respuesta = await pool.request()
            .input('asset', sql.Int, asset)
            .input('fecha', sql.Date, fecha)
            .input('texto', sql.Text, info.texto)
            .query('insert into historial_mantenimiento (asset_equipo, fecha_ingreso, causa, fecha_eliminacion) values (@asset, @fecha, @texto, null)')
        console.log(respuesta)
    } catch (error) {
        console.error("Hubo problema al generar dato en historial_mantenimiento", error)
    }
})
//--> Designar equipo
router.post("/designarEquipo", async (req, res) => {
    const pool = await getConnection()
    const info = req.body
    const estado = info.estado
    const fecha = dayjs().format('YYYY-MM-DD')
    const asset = parseInt(info.asset, 10)
    console.log(info, estado, asset, fecha)
    
    try {
        const respuesta = await pool.request()
            .input('asset', sql.Int, asset)
            .input('fecha', sql.Date, fecha)
            .query(`update movimientos set rut_persona=0, ultima_modificacion=@fecha, ubicacion=9, estado=2, alias='' where asset=@asset`)
        console.log("Se actualizo movimientos: ", respuesta)
    } catch (error) {
        console.error("Hubo un problema al designar equipo en movimientos", error)
    }

    if (estado === "asignado") {
        try {
            const respuesta = await pool.request()
                .input('fecha', sql.Date, fecha)
                .input('asset', sql.Int, asset)
                .query('update historial_usuarios set fecha_eliminaicion=@fecha where fecha_eliminaicion is NULL and asset_equipo=@asset')
            console.log("Se actualizo historial_usuarios: ", respuesta)
            res.send(respuesta)
        } catch (error) {
            console.error("Hubo un problema al designar equipo usuario", error)
        }
    } else if (estado === "arreglando") {
        try {
            const respuesta = await pool.request()
                .input('fecha', sql.Date, fecha)
                .input('asset', sql.Int, asset)
                .query('update historial_mantenimiento set fecha_eliminacion=@fecha where fecha_eliminacion is null and asset_equipo=@asset')
            console.log("Se actualizo historial_mantenimiento: ", respuesta)
            res.send(respuesta)
        } catch (error) {
            console.error("Hubo un problema al designar equipo mantenimiento", error)
        }
    }
})
router.post("/eliminarEquipo", async (req, res) => {
    const pool = await getConnection()
    const info = req.body
    console.log(info.asset)
    const fecha = dayjs().format('YYYY-MM-DD')
    
    try {
        const respuesta = await pool.request()
            .input('asset', sql.Int, info.asset)
            .input('fecha', sql.Date, fecha)
            .query(`update equipos set eliminacion_equipo=@fecha where asset_equipo=@asset`)
        console.log(respuesta)
    } catch (error) {
        console.error("Hubo un error en la modificacion de equipos", error)
        return
    }

    try {
        const respuesta = await pool.request()
            .input('asset', sql.Int, info.asset)
            .input('fecha', sql.Date, fecha)
            .query(`update historial_usuarios set fecha_eliminaicion=@fecha where asset_equipo=@asset and fecha_eliminaicion is null`)
        console.log(respuesta)
    } catch (error) {
        console.error("Hubo un error en la modificacion de historial_usuarios", error)
        return
    }

    try {
        const respuesta = await pool.request()
            .input('asset', sql.Int, info.asset)
            .input('fecha', sql.Date, fecha)
            .query(`update historial_mantenimiento set fecha_eliminacion=@fecha where asset_equipo=@asset and fecha_eliminacion is null`)
        console.log(respuesta)
    } catch (error) {
        console.error("Hubo un error en la modificacion de historial_mantenimiento", error)
        return
    }

    try {
        const respuesta = await pool.request()
            .input('asset', sql.Int, info.asset)
            .input('fecha', sql.Date, fecha)
            .query(`update movimientos set rut_persona=0, ultima_modificacion=@fecha, ubicacion=9, estado=3, alias='' where asset=@asset`)
        console.log(respuesta)
        res.send(respuesta)
    } catch (error) {
        console.error("Hubo un error en la eliminacion del equipo", error)
        return
    }
    
})

//<-------------- historialMantenimientos --->
router.get('/historialMantenimiento/:asset', async (req, res) => {
    const pool = await getConnection()
    const asset = req.params.asset
    try {
        const respuesta = await pool.request()
            .input('asset', sql.Int, asset)
            .query('select * from Informacion_mantenimiento where asset=@asset')
        console.log(respuesta.recordset)
        res.send(respuesta.recordset)
    } catch (error) {
        console.error("Hubo un error en la obtencion de los datos de tabla historialMantenimiento", error)
    }
})

//<-------------- historialUsuarios --->
router.get('/historialUsuarios/:asset', async (req, res) => {
    const pool = await getConnection()
    const asset = req.params.asset
    try {
        const respuesta = await pool.request()
            .input('asset', sql.Int, asset)
            .query('select * from Informacion_historial_usuarios where asset_equipo=@asset')
        console.log(respuesta.recordset)
        res.send(respuesta.recordset)
    } catch (error) {
        console.error("Hubo un error en la obtencion de los datos de tabla historiaUsuarios", error)
    }
})

//<-------------- Generales ------------------>
router.get("/LAC", async (req, res) => {
    const pool = await getConnection()
    try {
        const info = await pool.request().query('select nombre_lac from lac')
        console.log(info)
        res.send(info.recordset)
    } catch (error) {
        console.error("Hubo error al conseguir valores de los LAC", error)
    }

})

export default router