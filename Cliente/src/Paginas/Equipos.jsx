import Encabezado from "../components/Encabezado"
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom' 
import Servicio from '../Servicios/Servicio'
import { Link } from 'react-router-dom'
import ModificarEquipo from "../components/modificarEquipo"
import AsignarEquipo from "../components/asignarEquipo"
import { Tooltip } from 'react-tooltip'

const Equipos = () => {
    const [modificarEquipo, setmodificarEquipo] = useState(true)//Boton para modificar equipo
    const [asignarEquipo, setasignarEquipo] = useState(true)
    const [designarEquipo, setdesignarEquipo] = useState(false)
    const [enUso, setenUso] = useState(null)
    const navigate = useNavigate() 

    //Verificar si hay usuario logeado o no a traves del sessionStorage
    const getUsuario = JSON.parse(sessionStorage.getItem("usuario"))
    
    //Conseguir los datos del equipo por medio de los params
    const asset = useParams().asset
    const [info, setInfo] = useState() //Aqui se almacena la informacion del equipo
    useEffect(() => {
        const conseguirInfo = async () => {
            //console.log("El asset es: ", asset)
            const respuesta = await Servicio.Equipos(asset)
            setInfo(respuesta)
            console.log("La informacion conseguida es: ", respuesta)
        }
        if (asset) {
            conseguirInfo()
        }
    }, [asset])
    
    //Aqui se procesara la informacion para poder asignarla a valores
    const [informacion, setInformacion] = useState()
    const [caracteristicas, setCaracteristicas] = useState() // Esta variable tiene las caracteristicas del equipo 
    const [categoria, setCategoria] = useState() // Esta variable contiene a que tipo de dispositivo es
    const [informacionValida, setinformacionValida] = useState() // Esta variable tiene la informacion general del equipo
    useEffect(() => {
        if (info) {
            setCategoria(info[0].recordset);
            setInformacion(info[2].recordset);
            setCaracteristicas(info[1].recordset[0]);
        }
    }, [info]);

    useEffect(() => {
        if (informacion && informacion.length > 0) {
            const informacion_procesada = Object.entries(informacion[0]).map(([key, value]) => {
                if (["ultima modificacion", "eliminacion de equipo", "creacion de equipo"].includes(key)) {
                    return { key, value: dayjs(value).format("DD-MM-YYYY") };
                }
                return { key, value };
            });

            setinformacionValida(informacion_procesada);
        }
    }, [informacion]);

    useEffect(() => {
        if (informacionValida && informacionValida.length > 7) {
            setenUso(`${informacionValida[6].value}`);
        }
    }, [informacionValida]);
    if (enUso) {
        console.log(enUso)
    }
    //Aqui se designara equipo
    if (designarEquipo) {
        const equipodesignado = { asset: asset, estado: informacionValida[6].value }
        console.log("El equipo a designar es: ", equipodesignado)
        
        const actualizarDesignar = async () => {
            const respuesta = await Servicio.designarEquipo(equipodesignado)
            console.log("Se ha designado el equipo",respuesta)
            window.location.reload()
        }
        actualizarDesignar()
    }

    //Se maneja informacion para mostrar en pantalla
    const Form_info = () => {
        if (!informacionValida) return null
        if (!caracteristicas) return null

        const [file, setFile] = useState()
        const [cambiarFirmado, setCambiarFirmado] = useState(false)
        const url = `http://172.20.2.5:8080/descargarArchivo/${informacionValida[0].value}`
        if (informacionValida && informacionValida[11]?.value && !file) {
            setFile(informacionValida[11].value.data)
        }
        
        const handleChange = async (e) => {
            e.preventDefault()
            const newFile = e.target.files[0]
            const archivo = new FormData()
            archivo.append('asset', informacionValida[0].value)
            archivo.append('archivo', newFile)
            try {
                const respuesta = await Servicio.documentoFirmado(archivo)
                console.log(respuesta)
                respuesta ? navigate(0) : null
            } catch (error) {
                console.error("Hubo un error al subir el archivo", error)
            }
        }

        console.log("informacionValida: ", informacionValida)
        console.log("caracteristicas: ", caracteristicas)
        return (
            <>
                <Form>
                    <br/>
                    {
                        Object.entries(caracteristicas).map(([key, value]) => (
                            <>
                                <InputGroup key={key}>
                                    <InputGroup.Text>{key}</InputGroup.Text>
                                    <Form.Control
                                        placeholder={value}
                                        disabled
                                    />
                                </InputGroup>
                                <br/>
                            </>
                        ))
                    }
                    <hr />
                    <br />
                    {
                        informacionValida.map((item, index) => {
                            if (item.key === "nombre") {
                                const nombre_apellido = `${informacionValida[index].value} ${informacionValida[index + 1].value}`
                                return (
                                    <>
                                        <InputGroup>
                                            <InputGroup.Text>Persona a cargo</InputGroup.Text>
                                            <Form.Control
                                                placeholder={nombre_apellido}
                                                disabled
                                            />
                                        </InputGroup>
                                        <br />
                                    </>
                                )
                            }

                            if (informacionValida[index].key === "apellido") return null

                            if (item.key === "Documento firmado") {
                                return (
                                    <>
                                        <InputGroup>
                                            <InputGroup.Text>Documento firmado</InputGroup.Text>
                                            {
                                                getUsuario && informacionValida[1].value !== '' ?
                                                    <>
                                                        {
                                                            !file || cambiarFirmado ?
                                                                <Form.Control
                                                                    type="file"
                                                                    disabled={!cambiarFirmado}
                                                                    onChange={handleChange}
                                                                    className="mb-2"
                                                                />
                                                                :
                                                                <Form.Text className="text-muted">
                                                                        <div className="d-flex align-items-center">
                                                                        <Button as="a" href={url} download variant="outline-secondary" className="m-2 p-2">Documento_{informacionValida[1].value}_{informacionValida[2].value}</Button>
                                                                        </div>
                                                                </Form.Text>
                                                        }
                                                        <Form.Check
                                                            type="checkbox"
                                                            className="p-2 mt-2"
                                                            data-tooltip-id="id-tooltip"
                                                            data-tooltip-content="Cambiar archivo"
                                                            onClick={() => setCambiarFirmado(!cambiarFirmado)}
                                                        />
                                                        <Tooltip id="id-tooltip" place="top" type="dark" effect="solid" />
                                                    </>
                                                    :
                                                    <Form.Text className="text-muted border">
                                                        {
                                                            file ? 
                                                                <div className="d-flex align-items-center">
                                                                    <Button as="a" href={url} download variant="outline-secondary" className="m-2 p-2">Documento_{informacionValida[1].value}</Button>
                                                                </div>
                                                                :
                                                                "No hay archivo actualmente"
                                                        }
                                                    </Form.Text>
                                            }
                                        </InputGroup>
                                        <br />
                                    </>
                                )
                            }
                            return(
                                <>
                                    <InputGroup key={index}>
                                        <InputGroup.Text>{item.key}</InputGroup.Text>
                                        <Form.Control
                                            placeholder={item.value}
                                            disabled
                                        />
                                    </InputGroup>
                                    <br />
                                </>
                            )
                        })
                    }
                </Form>
            </>
        )
    }
    
    return (
        <div className="mt-5">
            < Encabezado />
            <Card style={{ width: "550px" }}>
                <Card.Header className="border rounded">
                    <Row className="align-items-center">
                        <Col>
                            <Card.Title>
                                Service Tag: {caracteristicas ? caracteristicas.id_service_tag : null }
                            </Card.Title>
                        </Col>
                        {
                            getUsuario && asignarEquipo ? 
                                <Col>
                                    <Button onClick={() => setmodificarEquipo(!modificarEquipo)} title="Modificar especificaciones del equipo"> { modificarEquipo ? "ModificarEquipo" : "Volver atras" } </Button>
                                </Col>
                                : null
                        }
                    </Row>
                </Card.Header>
                <Card.Body>
                    {
                        modificarEquipo && asignarEquipo ?
                            <>
                                <Form_info />
                                <Row>
                                    <Col>
                                        <Button as={Link} to={`/historialMantenimiento/${asset}`} title="Tabla de los mantenimientos hecho al equipo"> Historial mantenimiento </Button>
                                    </Col>
                                    <Col>
                                        <Button as={Link} to={`/historialusuario/${asset}`} title="Tabla de los usuarios que han usado el equipo"> Historial usuarios </Button>
                                    </Col>
                                </Row>
                            </>
                            : 
                            null
                    }
                    {
                        modificarEquipo ?
                            null
                            :
                            <ModificarEquipo /> 
                    }
                    {
                        asignarEquipo ?
                            null :
                            <AsignarEquipo />
                    }
                    <br/>
                    <Row>
                        {getUsuario && modificarEquipo && (
                            <>
                                <Col>
                                    {enUso !== 'asignado' && enUso !== "arreglando" ? (
                                        <Button onClick={() => setasignarEquipo(!asignarEquipo)}>
                                            {asignarEquipo ? "Asignar equipo" : "Volver atras"}
                                        </Button>
                                    ) : (
                                        <Button onClick={() => setdesignarEquipo(!designarEquipo)} title="Designar el equipo de su estado">
                                            Designar equipo
                                        </Button>
                                    )}
                                </Col>
                            </>
                        )}
                        <Col>
                            <Button onClick={() => navigate('/verEquipos')}> Volver atras</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Equipos