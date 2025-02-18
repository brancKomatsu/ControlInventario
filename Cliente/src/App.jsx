import '../Views/App.css'
import VerEquipos from './Paginas/verEquipos'
import IniciarSesion from './Paginas/IniciarSesion'
import Registro from './Paginas/Registro'
import Equipos from './Paginas/Equipos'
import CreacionEquipo from './Paginas/CreacionEquipo'
import Empleados from './Paginas/Empleados'
import AgregarEmlpleado from './Paginas/agregarEmpleado'
import HistorialMantenimiento from './Paginas/historialMantenimiento'
import HistorialUsuario from './Paginas/historialUsuario'
import InfoEmpleado from './Paginas/InfoEmpleado'
import Home from './Paginas/home'
import Oficinas from './Paginas/Oficinas'
import AgregarOficina from './Paginas/AgregarOficina'
import Lac from './Paginas/Lac'
import AgregarLac from './Paginas/AgregarLac'
import EditarLac from './Paginas/EditarLac'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ActualizarOficina from './Paginas/actualizarOficina'

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/home' element={<Home />} />
                <Route path='/verEquipos' element={<VerEquipos />} />
                <Route path='/iniciarsesion' element={<IniciarSesion />} />
                <Route path='/Registro' element={<Registro />} />
                <Route path='/equipo/:asset' element={<Equipos />} />
                <Route path='/CreacionEquipo' element={<CreacionEquipo />} />
                <Route path='/Empleados' element={<Empleados />} />
                <Route path='/agregarEmpleado' element={<AgregarEmlpleado />} />
                <Route path='/historialUsuario/:asset' element={<HistorialUsuario />} />
                <Route path='/historialMantenimiento/:asset' element={<HistorialMantenimiento />} />
                <Route path='/Empleado/:rut' element={<InfoEmpleado />} />
                <Route path='/Lac' element={<Lac />} />
                <Route path='/AgregarLac' element={<AgregarLac />} />
                <Route path='/Lac/:lac/:id' element={<EditarLac />} />
                <Route path='/Oficinas' element={<Oficinas />} />
                <Route path='/agregarOficinas' element={<AgregarOficina />} />
                <Route path='/oficina/:nombre/:id' element={<ActualizarOficina />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
