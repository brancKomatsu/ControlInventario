import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Servicio from '../Servicios/Servicio.js'


const Registro = () => {
    const [correo, setCorreo] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [id, setId] = useState("")
    const [error, setError] = useState(false)
    const [user, setUser] = useState({})
    let navigate = useNavigate()

    const validarDatos = () => {

        if (contrasena === "" || correo === "" || id !== "12345") {
            setError(true)
            window.alert("Todos los campos son obligatorios")
            return false
        } else {
            setError(false)
            return true
        }

    }

    const Registros = async (e) => {
        e.preventDefault()

        if (!validarDatos()) return

        try { 
            const usuario = await Servicio.registro({ correo, contrasena })
            console.log(usuario)
            if (usuario !== null) {

                setUser(usuario)
                sessionStorage.setItem("usuario", JSON.stringify(usuario))
                console.log("Registro realizado con exito")
                navigate('/home')

            } else {
                window.alert("Correo electronico ya existe")
            }
        } catch (e) {
            console.error("Hubo un error en la conexion", e)
        }
    }



    return (
        <>
            <Card style={{ width: '20rem' }}>
                <Card.Title> Komatsu</Card.Title>
                <Card.Body>
                    <Form onSubmit={Registros}>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Correo electronico</Form.Label>
                            <Form.Control
                                value={correo}
                                type="email"
                                placeholder="Correo electronico"
                                onChange={(e) => setCorreo(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Contrasena</Form.Label>
                            <Form.Control
                                value={contrasena}
                                type="password"
                                placeholder="Contrasena"
                                onChange={(e) => setContrasena(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>ID Verificación</Form.Label>
                            <Form.Control
                                value={id}
                                type="text"
                                placeholder="Id Verificación"
                                onChange={(e) => setId(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" type="submit"> Crear usuario</Button>
                        {error && <p> Todos los cambios son obligatorios </p>}

                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}

export default Registro