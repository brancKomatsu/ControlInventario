import { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import InputGroup from 'react-bootstrap/InputGroup'
import Servicio from '../Servicios/Servicio'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Encabezado from '../components/Encabezado'
import Select from 'react-select'
import { Link, useNavigate } from 'react-router-dom'

const agregarEmlpleado = () => {
    const navigate = useNavigate()
    const [datos, setDatos] = useState([])
    const [oficinas, setOficinas] = useState([])
    const [options, setOptions] = useState({})
    const [optionsOficina, setOptionsOficinas] = useState({})
    const [lac, setLac] = useState()
    const [empleado, setEmpleado] = useState({
        rut: '',
        nombre: '',
        apellido: '',
        lac: '',
        correo_electronico: ''
    })

    useEffect(() => {
        const fecthDatos = async () => {
            const respuesta = await Servicio.columnasEmpleados()
            const lac = await Servicio.lac()
            const oficina = await Servicio.oficinas()
            console.log("Las columnas de los empleados son: ", respuesta.data)
            console.log("Las nombres de los lac son: ", lac)
            setDatos(respuesta.data)
            setLac(lac)
            setOficinas(oficina)
        }
        fecthDatos()
    }, [])

    const handleChange = (key, value) => {
        setEmpleado(prev => ({
            ...prev,
            [key]: value
        }))
    }

    useEffect(() => {
        if (lac) {
            console.log("EL lac es: ", lac)
            const valores = lac.map(item => ({
                value: item.nombre_lac,
                label: `${item.nombre_lac}`                                         
            }))
            if (JSON.stringify(valores) !== JSON.stringify(options)) {
                setOptions(valores);
            }
            console.log(options)
        }
    }, [lac])
    useEffect(() => {
        if (oficinas) {
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (empleado.rut === "" || empleado.nombre === "" || empleado.apellido === "" || empleado.lac === "" || empleado.correo_electronico === "" ||empleado.oficna_id === "") {
            window.alert("Todos los campos son obligatorios")
            return null
        } 
        try {
            const respuesta = await Servicio.crearEmpleado(empleado)
            console.log(respuesta)
            navigate("/Empleados")
        } catch (e) {
            console.error("Hubo un error al mandar la informacion a la API", e)
        }
        
        console.log(empleado)
    }

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



    return (
        <>
            <Encabezado />
            <Card>
                <Card.Header className="border rounded">
                    <Card.Title> Agregar Empleado</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {
                            datos.map((item, index) => {
                                if (item.column_name === "estado") return null
                                if (item.column_name === "lac") {
                                    return (
                                        <InputGroup className='mb-3' key={index}>
                                            <InputGroup.Text> {item.column_name} </InputGroup.Text>
                                            <Select options={options} styles={customStyles} onChange={(selectedOption) => handleChange(item.column_name, selectedOption.value)} />
                                        </InputGroup>
                                    )
                                }
                                if (item.column_name === "oficina_id") {
                                    return (
                                        <InputGroup className='mb-3' key={index}>
                                            <InputGroup.Text> Oficina </InputGroup.Text>
                                            <Select options={optionsOficina} styles={customStyles} onChange={(selectedOption) => handleChange(item.column_name, selectedOption.value)} />
                                        </InputGroup>
                                    )
                                }
                                return (
                                    <InputGroup className='mb-3' key={index}>
                                        <InputGroup.Text> {item.column_name} </InputGroup.Text>
                                        <Form.Control
                                            value={empleado.item}
                                            placeholder={item.key}
                                            onChange={(e) => handleChange(item.column_name, e.target.value)}
                                        />
                                    </InputGroup>
                                )
                            })
                        }
                        <br/>
                        <Button type="submit" title="Anadir empleado a la base de datos"> Agregar empleado</Button>
                    </Form>
                    <br />
                    <Button onClick={() => navigate(-1)}> Volver atras</Button>
                </Card.Body>
            </Card>
        </>
    )
}
export default agregarEmlpleado