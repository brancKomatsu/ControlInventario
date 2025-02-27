import Servicio from '../Servicios/Servicio'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import Encabezado from '../components/Encabezado'

const InfoEmpleado = () => {
    const [empleado, setEmpleado] = useState()
    const [eliminar, setEliminar] = useState(false)
    const [options, setOptions] = useState({})
    const [lac, setLac] = useState()
    const [oficinas, setOficinas] = useState([])
    const [optionsOficina, setOptionsOficinas] = useState({})

    const rut = useParams()
    const navigate = useNavigate()

    //Obtener la informacion del empleado seleccionado
    useEffect(() => {
        const fetchDato = async () => {
            try {
                const respuesta = await Servicio.empleadoUnico(rut.rut)
                setEmpleado(respuesta)
            } catch (error) {
                console.error("Hubo un error en la obtencion del empleado", error)
            }
        }
        fetchDato()
    }, [])

    //Conseguir los Lac existentes para mostrar como opciones
    useEffect(() => {
        const fecthDatos = async () => {
            const lac = await Servicio.lac()
            console.log("Las nombres de los lac son: ", lac)
            setLac(lac)

            const valores = lac.map(item => ({
                value: item.nombre_lac,
                label: `${item.nombre_lac}`
            }))
            setOptions(valores)
        }
        fecthDatos()
    }, [])

    //Conseguir las oficinas existentes 
    useEffect(() => {
        const fecthDatos = async () => {
            const oficina = await Servicio.oficinas()
            setOficinas(oficina)
        }
        fecthDatos()
    }, [])

    //Mostrar las oficinas como opciones
    useEffect(() => {
        if (oficinas.length > 0) {
            console.log("Las oficinas son: ", oficinas)
            const valores = oficinas.map(item => ({
                value: item.nombre_oficina,
                label: `${item.nombre_oficina}`                                         
            }))
            if (JSON.stringify(valores) !== JSON.stringify(oficinas)) {
                setOptionsOficinas(valores);
            }
            console.log(oficinas)
        }
    }, [oficinas])

    //Estilos para Select (mostrar las opciones)
    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: "400px",
            borderRadius: "8px",
            boxShadow: "none",
            textAlign: "left"
        }),
        option: (provided) => ({ ...provided, color: "black" }),
    }

    //Funcion para eliminar el empleado
    useEffect(() => {
        if (eliminar) {
            const eliminarEmpleado = async () => {
                console.log("eliminando")
                try {
                    const respuesta = await Servicio.eliminarEmpleado(rut)
                    if (respuesta) {
                        navigate("/Empleados")
                    }
                } catch (error) {
                    console.error("Hubo un error con la eliminacion del empleado", error)
                }
            }
            eliminarEmpleado()
        }
    }, [eliminar])

    //Manejar los cambios hechos a los datos de los empleados
    const handleChange = ( key, value) => {
        console.log(key, value)
        setEmpleado(prev => ({
            ...prev,
            [key]: value
        }))
    }

    //Subir los datos cambiados a la base de datos
    const handleSubmit = async (e) => {
        e.preventDefault()
        const confirmacion = window.confirm("¿Estas seguro de modificar el empleado?")
        const nuevoValor = {
            ...empleado,
            nombre: empleado.nombre.toUpperCase(),
            apellido: empleado.apellido.toUpperCase()
        }
        console.log("El valor a subir es: ", nuevoValor)
        
        if (confirmacion) {
            const respuesta = await Servicio.actualizarEmpleado(nuevoValor)
            if (respuesta) {
                navigate("/Empleados")
            }
        } else {
            return null
        }
        
    }

    return (
        <>
            <Encabezado />
            <Card style={{ width: "600px" }}>
                <Card.Header className="border rounded">
                    {
                        empleado ? 
                            <Card.Title>{empleado.nombre} {empleado.apellido}</Card.Title>
                            :
                            null
                    }
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {
                            empleado && options.length > 0 && optionsOficina.length > 0 ? (
                                    Object.entries(empleado).map(([key, item]) => {
                                        if (key === "lac") {
                                            return (
                                                <>
                                                    <InputGroup key={key}>
                                                        <InputGroup.Text>{key}</InputGroup.Text>
                                                        <Select 
                                                            options={options} 
                                                            value={options.find(option => option.value === item)} 
                                                            styles={customStyles} 
                                                            onChange={(selectedOption) => handleChange(key, selectedOption.value)} 
                                                        />
                                                    </InputGroup>
                                                    <br />
                                                </>
                                            )
                                        }
                                        if (key === "estado") return null
                                        if (key === "rut") {
                                            return (
                                                <>
                                                    <InputGroup key={key}>
                                                        <InputGroup.Text>{key}</InputGroup.Text>
                                                        <Form.Control
                                                            placeholder={item}
                                                            disabled
                                                        />
                                                    </InputGroup>
                                                    <br />
                                                </>
                                            )
                                        }
                                        if (key === "oficina") {
                                            return (
                                                <>
                                                    <InputGroup key={key}>
                                                        <InputGroup.Text>{key}</InputGroup.Text>
                                                        <Select 
                                                        options={optionsOficina} 
                                                        value={optionsOficina.find(option => option.value === item)} 
                                                        styles={customStyles} 
                                                        onChange={(selectedOption) => handleChange(key, selectedOption.value)} />
                                                    </InputGroup>
                                                    <br />
                                                </>
                                            )
                                        }
                                        return (
                                            <>
                                                <InputGroup key={key}>
                                                    <InputGroup.Text>{key}</InputGroup.Text>
                                                    <Form.Control
                                                        placeholder={item}
                                                        value={item}
                                                        onChange={(e) => handleChange(key, e.target.value)}
                                                    />
                                                </InputGroup>
                                                <br />
                                            </>
                                        )
                                    })
                                ) : null
                        }
                        <Row>
                            <Col>
                                <Button onClick={() => setEliminar(!eliminar) }> Dar de baja empleado</Button>
                            </Col>
                            <Col>
                                <Button type="Submit"> Realizar modificación </Button>
                            </Col>
                        </Row>
                    </Form>
                    <br />
                    <Button onClick={() => navigate(-1)}> Volver atrás</Button>
                </Card.Body>
            </Card>
        </>
    )
}
export default InfoEmpleado