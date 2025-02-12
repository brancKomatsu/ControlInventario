import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Encabezado from '../components/Encabezado'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const paginaPrincipal = () => {
    const [user, setUser] = useState()
    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("usuario"))
        if (storedUser) {
            setUser(storedUser)
        }
    },[])
    return (
        <>
            <Encabezado />
            <Card style={{ width:"600px"}}>
                <Row className="justify-content-center">
                    <Col xs={4}>
                        <Button as={Link} to="/verEquipos" title="Tabla de todos los equipos" className="w-100"> Ver equipo </Button>
                    </Col>
                    {
                        user
                            ?
                            <Col xs={4}>
                                <Button as={Link} to="/CreacionEquipo" title="Agregar dispositivo o agregar categoria" className="w-100"> Anadir equipo </Button>
                            </Col>
                            :
                            null
                    }
                    <Col xs={4}>
                        <Button as={Link} to="/Empleados" title="Tabla con los empleados" className="w-100"> Usuarios </Button>
                    </Col>
                </Row>
            </Card>
        </>
    )
}

export default paginaPrincipal