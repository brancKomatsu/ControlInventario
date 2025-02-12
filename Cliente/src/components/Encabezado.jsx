import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Encabezado = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("usuario"))
        if (storedUser) {
            setUser(storedUser)
        } else {
            setUser(null)
        }
    }, [])

    //Esta parte del codigo es para revisar si se ha iniciado sesion
    const SesionIniciada = () => {
        console.log(user)

        if (user) {
            const usuario = user[0].correo_electronico.split("@")
            //console.log("Sesion esta iniciada en pagina encabezado")
            return (
                <>
                    <span className="text-white">
                        {usuario[0]}
                        <Image src="../Images/Persona.svg" width={25} height={25} roundedCircle />
                    </span>
                </>
            )
        } else {
            //console.log("sesion no esta iniciada")
            return (
                <>
                    <Nav.Link className="align-items-center" as={Link} to="/iniciarsesion">
                        Iniciar Sesion
                    </Nav.Link>
                    <Nav.Link as={Link} to="/iniciarsesion"> 
                        <Image className="align-items-center" src="../Images/Persona.svg" width={25} height={25} roundedCircle/>
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
                    <Navbar.Toggle aria-controls="responsive-navbar-var" />
                    <Navbar.Collapse id="responsive-navbar-var" />
                    <Nav>
                        <SesionIniciada />
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default Encabezado