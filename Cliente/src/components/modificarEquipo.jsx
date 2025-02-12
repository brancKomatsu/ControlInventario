import { useState, useEffect } from 'react'
import Servicio from '../Servicios/Servicio'
import { useParams } from 'react-router-dom'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useNavigate } from 'react-router-dom'

const modificarEquipo = () => {
    const [datos, setDatos] = useState({})
    const asset = useParams().asset
    const navigate = useNavigate()

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const respuesta = await Servicio.columnasCaracteristicas(asset)
                setDatos(respuesta)
            } catch (error) {
                console.error("Hubo un error en la obtencion de datos de API")
            }
        }
        fetchDatos()
    }, [])

    console.log("El asset es: ", asset)

    const handleChange = (key, value) => {
        setDatos(prev => ({
            ...prev,
            [key]:value
        }))
    }
    console.log("Los valores actuales son: ", datos)

    const handleSubmit = async (e) => {
        const nuevoDato = {
            ...datos,
            asset: asset
        }
        console.log(nuevoDato)
        try {
            const respuesta = await Servicio.actualizarCaracteristica(nuevoDato)
            console.log("la respuesta fue: ", respuesta)
        } catch (error) {
            console.error("Hubo un error en la peticion a api", error)
        }
    }

    const EliminarEquipo = async (e) => {
        e.preventDefault()
        const confirmacion = window.confirm("¿Estas seguro de eliminar el equipo?")
        if (confirmacion) {
            const valor = {asset: asset}
            try {
                const respuesta = await Servicio.eliminarEquipo(valor)
                console.log("la respuesta fue: ", respuesta)
                if (respuesta) {
                    window.location.reload()
                }
            } catch (error) {
                console.error("Hubo un error en la peticion a api", error)
            }
        } else {
            return null
        }
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                {
                    Object.entries(datos).map(([key, value]) => {
                        if(key === "id_service_tag") return null
                        return (
                            <>
                                <InputGroup key={key}>
                                    <InputGroup.Text>{key}</InputGroup.Text>
                                    <Form.Control
                                        value={value}
                                        placeholder={value}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                    />
                                </InputGroup>
                                <br/>
                            </>
                        )
                    })
                }
                <Row>
                    <Col>
                        <Button type="submit">Actualizar equipo</Button>
                    </Col>
                    <Col>
                        <Button onClick={(e) => EliminarEquipo(e)}>Eliminar equipo</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default modificarEquipo