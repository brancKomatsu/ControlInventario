import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Servicio from '../Servicios/Servicio'
import Encabezado from '../components/Encabezado'

const IniciarSesion = () => {
    const [correo, setCorreo] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [error, setError] = useState(false)
    const [user, setUser] = useState()
    const navigate = useNavigate()

    //Funcion par verificar que todos los datos hayan sido ingresadps
    const validarDatos = () => {

        if (contrasena === "" || correo === "") {
            setError(true)
            window.alert("Todos los campos son obligatorios")
            return false
        } else {
            setError(false)
            return true
        }

    }

    //Logica para iniciar sesion
    const Logeo = async (e) => {
        e.preventDefault()

        if (!validarDatos()) return

        try {
            const usuario = await Servicio.login({correo, contrasena})
            if (usuario.length !== 0) {
                setUser(usuario)
                sessionStorage.setItem("usuario", JSON.stringify(usuario))
                console.log("Inicio de sesion realizado con éxito")
                navigate(-1)   
            } else {
                window.alert("Valores incorrectos o no existe cuenta, intente de nuevo")
                console.log("credenciales incorrectas o no no existe la cuenta")
            }
        } catch (e) {
            console.error("Hubo un error en la conexion", e)
        }
    }

    return (
        <>
            <Encabezado />
            <Card style={{ width: '20rem' }}>
                <Card.Title> Komatsu</Card.Title>
                <Card.Body>
                    <Form onSubmit={Logeo}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control
                                value={correo}
                                type="email"
                                placeholder="Correo electrónico"
                                onChange={(e) => setCorreo(e.target.value) }
                            >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                value={contrasena}
                                type="password"
                                placeholder="Contraseña"
                                onChange={ (e) => setContrasena(e.target.value) }
                            >
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit"> Iniciar sesión</Button>
                        {error && <p> Todos los cambios son obligatorios </p>}
                        <div className="mt-3 text-start">
                            <Link to="/Registro"> Crear usuario </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}

export default IniciarSesion