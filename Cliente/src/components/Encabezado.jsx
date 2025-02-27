import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Persona from '../../Images/Persona.svg'

const Encabezado = () => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    //Verificar si se ha inciado sesion
    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("usuario"))
        if (storedUser) {
            setUser(storedUser)
        } else {
            setUser(null)
        }
    }, [])

    //Manejo para cerrar sesino
    const cerrarSesion = () => {
        setUser(false)
        sessionStorage.removeItem("usuario")
        if (window.location.pathname === '/CreacionEquipo') navigate('/home')
        if (window.location.pathname === '/agregarUsuario') navigate('/Usuarios')
        if (location.pathname.startsWith('/Usuario/')) navigate('/Usuarios')
        window.location.reload()
    }

    //Esta parte del codigo es para revisar si se ha iniciado sesion
    const SesionIniciada = () => {

        if (user) {
            const usuario = user[0].correo_electronico.split("@")
            //console.log("Sesion esta iniciada en pagina encabezado")
            return (
                <>
                    <span className="text-white d-flex align-items-center">
                        {usuario[0]}
                        <Image src={Persona} width={25} height={25} roundedCircle className="ms-2"/>
                    </span>
                    <NavDropdown title="Adicionales" id="navbarScrollingDropdown">
                        <NavDropdown.Item as={Link} to="/Lac">LAC</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/Oficinas">Oficinas</NavDropdown.Item>
                    </NavDropdown>
                    <Button variant='' onClick={cerrarSesion}>Cerrar sesión</Button>
                </>
            )
        } else {
            //console.log("sesion no esta iniciada")
            return (
                <>
                    <Nav.Link className="align-items-center" as={Link} to="/iniciarsesion">
                        Iniciar Sesión
                    </Nav.Link>
                    <Nav.Link as={Link} to="/iniciarsesion"> 
                        <Image className="align-items-center" src={Persona} width={25} height={25} roundedCircle/>
                    </Nav.Link>
                </>
            )
        }
    } 

    return (
        <>
            <Navbar fixed="top" expand="lg" bg="primary" data-bs-theme="dark" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand as={Link} to="/home"> Komatsu </Navbar.Brand>
                    <Nav>
                        <SesionIniciada />
                    </Nav>
                </Container>
            </Navbar>
            <br/>
            <br/>
        </>
    )
}

export default Encabezado