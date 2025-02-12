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
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Paginas/home'
import InfoEmpleado from './Paginas/InfoEmpleado'

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
                <Route path='/Empleado/:rut' element={<InfoEmpleado /> } />
            </Routes>
        </BrowserRouter>
    )
}

export default App
