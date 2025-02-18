import axios from 'axios'

const baseUrl = "http://172.20.2.5:8080"

//<--------- verEquipos ------------------>
const verEquipos = async () => {
    try {
        const respuesta = await axios.get(`${baseUrl}/verEquipos`)
        console.log(respuesta.data)
        return respuesta
    } catch (error) {
        console.error('error en la peticion', error)
    }
}
const categorias = async () => {
    try {
        const respuesta = await axios.get(`${baseUrl}/categorias`)
        console.log(respuesta.data)
        return respuesta.data
    } catch (error) {
        console.error("Hubo un error al obtener los datos: ", error)
    }
}
const tablaCategoria = async info => {
    console.log(info)
    try {
        const respuesta = await axios.get(`${baseUrl}/tablaCategorias/${info}`)
        console.log(respuesta.data)
        return respuesta.data
    } catch (error) {
        console.error("Hubo un error al obtener los datos: ", error)
    }
}
const documentoFirmado = async info => {
    console.log(info)
    try {
        const respuesta = await axios.post(`${baseUrl}/subirArchivo`, info,
            { header: {'Content-Type': 'multipart/form-data'} })
        console.log(respuesta)
        return respuesta
    } catch (error) {
        console.error("Hubo un error al enviar la informacion al servidor", error)
    }
}

//<--------- Empleados ------------------->
const datoEmpleados = async () => {
    try {
        const info = await axios.get(`${baseUrl}/datosEmpleados`)
        return info
    } catch (error) {
        console.error("Hubo error al conseguir datos de empleados", error)
    }
}
//--> Columnas Empleados
const columnasEmpleados = async () => {
    try {
        const info = await axios.get(`${baseUrl}/columnasEmpleados`)
        console.log(info)
        return info
    } catch (error) {
        console.error("Hubo un error al conseguir los nombres de columnas de los empleados", error)
    }
}
//--> Crear Empleado
const crearEmpleado = async info => {
    console.log("Informacion recivida: ", info)
    try {
        const respuesta = await axios.post(`${baseUrl}/crearEmpleado`, info)
        console.log(respuesta)
        return respuesta
    } catch (error) {
        console.error("HUbo un error en la creacion de un empleado", error)
    }
}
//--> Empleado Unico
const empleadoUnico = async info => {
    console.log("El rut del empleado a preguntar es: ", info)
    try {
        const respuesta = await axios.get(`${baseUrl}/EmpleadoUnico/${info}`)
        return respuesta.data[0]
    } catch (error) {
        console.error("Hubo un error al obtener respuesta", error)
    }
}
//--> Eliminar Empleado
const eliminarEmpleado = async asset => {
    console.log(asset)
    try {
        const respuesta = await axios.post(`${baseUrl}/eliminarEmpleado`, asset)
        return respuesta
    } catch (error) {
        console.error("Hubo un error al eliminar", error)
    }
}
//--> Actualizar Empleado
const actualizarEmpleado = async info => {
    console.log(info)
    try {
        const respuesta = await axios.post(`${baseUrl}/modificarEmpleado`, info)
        return respuesta
    } catch (error) {
        console.error("Hubo un error en la respuesta del servidor", error)
    }
}


//<--------- Registro -------------------->
const registro = async credentials => {
    try {
        const respuesta = await axios.post(`${baseUrl}/Registro`, credentials)
        console.log(respuesta.data)
        return respuesta.data
    } catch (error) {
        console.error('error en la solicitud de registro', error)
    }
}

//<--------- Login ----------------------->
const login = async credentials => {
    try {
        const respuesta = await axios.post(`${baseUrl}/Login`, credentials)
        console.log(credentials)
        console.log(respuesta.data)
        return respuesta.data
    } catch (error) {
        console.error('error en la solicitud de inicio de sesion', error)
    }
}


//<--------- CreacionEquipo -------------->
const creacionEquipo = async () => {
    try {
        const respuesta = await axios.get(`${baseUrl}/CreacionEquipo`)
        //console.log(respuesta.data)
        return respuesta.data
    } catch (error) {
        console.error("Hubo un error em la solicitud de acceso nombre tablas", error)
    }
}
//--> Crear Tabla
const subirTabla = async info => {
    try {
        const respuesta = await axios.post(`${baseUrl}/subirTabla`, info, { header: { 'content-type': 'application/json' } })
        consle.log(respuesta)
    } catch (error) {
        console.error("Hubo un error en la solicitud", error)
    }
}
//--> Columnas tabla categoria
const columnasTabla = async credentials => {
    try {
        const respuesta = await axios.get(`${baseUrl}/infoEquipo`, { params: {tabla: credentials}})
        //console.log(respuesta.data)
        return respuesta.data
    } catch (error) {
        console.error("Hubo un error en la solicitud del nombre de las tablas", error)
    }
}
//--> Subir Equipo
const subirEquipo = async info => {
    console.log("los datos de info son: ", info)
    try {
        const respuesta = await axios.post(`${baseUrl}/subirEquipo`, info)
        console.log(respuesta)
        return respuesta.data
    } catch (error) {
        console.error("Hubo error en la peticion a servidor")
    }
    
}

//<---------- Actualizar Equipo ------------>
const Equipos = async info => {
    //console.log("Equipo de asset: ", info)
    try {
        const respuesta = await axios.get(`${baseUrl}/Equipo/${info}`)
        //console.log("La respuesta a la solicitud es: ", respuesta.data)
        return respuesta.data
    } catch (error) {
        console.error("Error en solicitud de equipos", error)
    }
}
//--> columnas caracteristicas
const columnasCaracteristicas = async info => {
    try {
        const respuesta = await axios.get(`${baseUrl}/Caracteristicas/${info}`)
        console.log(respuesta.data)
        return respuesta.data
    } catch (error) {
        console.error("Hubo error en la peticion a servidor", error)
    }
}
//--> Actualizar caracteristicas
const actualizarCaracteristica = async info => {
    try {
        const respuesta = await axios.post(`${baseUrl}/actualizarCaracteristica`, info)
        console.log(respuesta.data)
        return respuesta.data
    } catch (error) {
        console.error("Hubo un error en la peticion a servidor", error)
    }
}
//--> nombre y apellido
const nombreApellido = async () => {
    try {
        const respuesta = await axios.get(`${baseUrl}/nombreapellido`)
        console.log(respuesta)
        return respuesta.data
    } catch (error) {
        console.error("Hubo error al conseguir los nombres de los usuarios", error)
    }
}
//--> asignar usuario
const asignarUsuario = async info => {
    console.log(info)
    try {
        const respuesta = await axios.post(`${baseUrl}/actualizarUsuario`, info)
        console.log(respuesta)
        return respuesta
    } catch (error) {
        console.error("Hubo un error al asignar el usuario", error)
    }
}
//--> crear mantenimiento
const crearMantenimiento = async info => {
    console.log(info)
    try {
        const respuesta = await axios.post(`${baseUrl}/crearMantenimiento`, info)
        console.log(respuesta)
    } catch (error) {
        console.error("Hubo un error en la creacion del mantenimiento", error)
    }
}
//--> Designar equipo
const designarEquipo = async info => {
    console.log(info)
    try {
        const respuesta = await axios.post(`${baseUrl}/designarEquipo`, info)
        return respuesta
        console.log(respuesta)
    } catch (error) {
        console.error("Hubo problema al enviar informacion a servidor", error)
    }
}
//--> Eliminar Equipo
const eliminarEquipo = async info => {
    console.log(info)
    try {
        const respuesta = await axios.post(`${baseUrl}/eliminarEquipo`, info, { headers: { 'Content-Type': 'application/json' } })
        return respuesta
        console.log(respuesta)
    } catch (error) {
        console.error("Hubo problema al enviar informacion a servidor", error)
    }
}


//<---------- historialMantenimiento ------->
const historialMantenimientos = async info => {
    console.log("El asset es: ", info)
    try {
        const respuesta = await axios.get(`${baseUrl}/historialMantenimiento/${info}`)
        console.log(respuesta)
        return respuesta.data
    } catch (error) {
        console.error("Hubo un error en la obtencion de datos de historialmanteniminetos", error)
    }
}

//<---------- historialUsuarios ------------>
const historialUsuarios = async info => {
    console.log("El asset es: ", info)
    try {
        const respuesta = await axios.get(`${baseUrl}/historialUsuarios/${info}`)
        console.log(respuesta)
        return respuesta.data
    } catch (error) {
        console.error("Hubo un error en la obtencion de datos de historialmanteniminetos", error)
    }
}

//<---------- General -------------------------->
const lac = async () => {
    try {
        const respuesta = await axios.get(`${baseUrl}/LAC`)
        console.log(respuesta.data)
        return respuesta.data
    } catch (error) {
        console.error("Hubo un error al conseguir los nombres de los lac", error)
    }
}
const subirLac = async info => {
    console.log(info)
    try {
        const respuesta = await axios.post(`${baseUrl}/subirLac`, info)
        console.log(respuesta)
        return respuesta
    } catch (error) {
        console.error("Hubo un error al subir el equipo", error)
    }
}
const actualizarLac = async info => {
    console.log(info)
    try {
        const respuesta = await axios.post(`${baseUrl}/actualizarLac`, info)
        console.log(respuesta)
        return respuesta
    } catch (error) {
        console.error("Hubo un error al subir el equipo", error)
    }
}
const eliminarLac = async info => {
    console.log(info)
    try {
        const respuesta = await axios.post(`${baseUrl}/EliminarLac`, info)
        console.log(respuesta)
        return respuesta
    } catch (error) {
        console.error("Hubo un error al subir el equipo", error)
    }
}
const oficinas = async () => {
    try {
        const respuesta = await axios.get(`${baseUrl}/oficina`)
        console.log(respuesta.data)
        return respuesta.data
    } catch (error) {
        console.error("Hubo un error al conseguir los nombres de las oficinas", error)
    }
}
const paises = async () => {
    try {
        const respuesta = await axios.get(`${baseUrl}/paises`)
        console.log(respuesta.data)
        return respuesta.data
    } catch (error) {
        console.error("Hubo un error al conseguir los nombres de los paises", error)
    }
}
const agregarOficina = async info => {
    console.log(info)
    try {
        const respuesta = await axios.post(`${baseUrl}/agregarOficina`, info)
        console.log(respuesta.data)
        return respuesta.data
    } catch (error) {
        console.error("Hubo un error al conseguir los nombres de los paises", error)
    }
}
const oficinaUnica = async info => {
    console.log(info)
    try {
        const respuesta = await axios.get(`${baseUrl}/oficinaUnica/${info}`)
        console.log(respuesta.data)
        return respuesta.data
    } catch (error) {
        console.error("Hubo un error al conseguir los valores de la oficina", error)
    }
}
const actualizarOficina = async info => {
    console.log(info)
    try {
        const respuesta = await axios.post(`${baseUrl}/actualizarOficina`, info)
        return respuesta
        console.log(respuesta)
    } catch (error) {
        console.error("Hubo un error al actualizar la informacion", error)
    }
}

export default {
    registro,
    login,
    verEquipos,
    Equipos,
    creacionEquipo,
    columnasTabla,
    subirEquipo,
    subirTabla,
    datoEmpleados,
    columnasEmpleados,
    crearEmpleado,
    historialMantenimientos,
    historialUsuarios,
    columnasCaracteristicas,
    actualizarCaracteristica,
    nombreApellido,
    lac,
    oficinas,
    asignarUsuario,
    crearMantenimiento,
    designarEquipo,
    empleadoUnico,
    eliminarEmpleado,
    categorias,
    tablaCategoria,
    actualizarEmpleado,
    eliminarEquipo,
    subirLac,
    actualizarLac,
    eliminarLac,
    paises,
    agregarOficina,
    oficinaUnica,
    actualizarOficina,
    documentoFirmado
}