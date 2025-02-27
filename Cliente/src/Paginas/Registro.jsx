import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Servicio from '../Servicios/Servicio.js'
import Encabezado from '../components/Encabezado'


const Registro = () => {
    const [correo, setCorreo] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [id, setId] = useState("")
    const [error, setError] = useState(false)
    const [user, setUser] = useState({})

    const navigate = useNavigate()

    //Funcion para validar que se ingresaron bien los datos
    const validarDatos = () => {
        console.log(contrasena, correo, id)
        if (contrasena === "" || correo === "" || id === "") {
            setError(false)
            window.alert("Todos los campos son obligatorios")
            return true
        } else if (id !== "12345") {
            setError(false)
            window.alert("El ID de verificacion no es correcto")
            return true
        } else {
            setError(true)
            return false
        }

    }

    //Funcion para subir registro a la bsae de datos
    const Registros = async (e) => {
        e.preventDefault()

        if (validarDatos()) return

        try { 
            const usuario = await Servicio.registro({ correo, contrasena })
            if (usuario !== null) {

                setUser(usuario)
                sessionStorage.setItem("usuario", JSON.stringify(usuario))
                console.log("Registro realizado con exito")
                navigate(-1)

            } else {
                window.alert("Correo electrónico ya existe")
            }
        } catch (e) {
            console.error("Hubo un error en la conexión", e)
        }
    }



    return (
        <>
            <Encabezado />
            <Card style={{ width: '20rem' }}>
                <Card.Title> Komatsu</Card.Title>
                <Card.Body>
                    <Form onSubmit={Registros}>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control
                                value={correo}
                                type="email"
                                placeholder="Correo electrónico"
                                onChange={(e) => setCorreo(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                value={contrasena}
                                type="password"
                                placeholder="Contraseña"
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