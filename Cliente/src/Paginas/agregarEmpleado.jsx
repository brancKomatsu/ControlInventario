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

    //Verificar si se ha iniciado sesion para ingresar a la pagina
    useEffect(() => {
        if (!sessionStorage.getItem("usuario")) navigate('/home')
    }, [])

    //Conseguir informacion de las columnas de los empleados para ingresar datos ademas de obtener informacion de las oficinas y los lac existentes
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

    //Manejar los valores ingresados
    const handleChange = (key, value) => {
        setEmpleado(prev => ({
            ...prev,
            [key]: value
        }))
    }

    //Manejar los lac para seleccion
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

    //Manejar las oficinas para seleccion
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

    //manejar subir los datos a base de datos
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!verificar_rut()) {
            return null
        }

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

    //Funcion para verificar que el rut esta bien ingresado
    const verificar_rut = () => {
        const numero_rut = empleado.rut.includes("-") ? empleado.rut.split("-") : []
        console.log(numero_rut)
        if (numero_rut[0] === empleado.rut || numero_rut.length !== 2) {
            window.alert("Tiene que ingresar el guion para el digito verificador")
            return false
        }
        if (numero_rut[1] === "") {
            window.alert("Tiene que ingresar un numero o letra para el codigo verificador")
            return false
        }
        var numero_verificador = 0
        var incrementador = 2
        for (var i = numero_rut[0].length - 1; i >= 0; i--) {
            numero_verificador = numero_verificador + (parseInt(numero_rut[0].charAt(i)) * incrementador)
            console.log(parseInt(numero_rut[0].charAt(i)), incrementador, numero_verificador)
            incrementador++
            if(incrementador > 7) incrementador = 2
        }
        var resta = parseInt(numero_verificador / 11) * 11
        var valor = (numero_verificador - resta)
        var verificador = 11 - valor
        if (verificador === 10) verificador = 'k'
        if (verificador === 11) verificador = '0'
        console.log(verificador)
        if (verificador != numero_rut[1]) {
            window.alert('Es incorrecto el rut ingresado, vuelva a intentarlo')
            return false
        }
        console.log("Es correcto el rut ingresado")
        return true
    }

    //Estilo de seleccion
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
                    <Card.Title> Agregar usuario</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {
                            datos.map((item, index) => {
                                if (item.column_name === "rut") {
                                    return (
                                        <InputGroup className='mb-3' key={index}>
                                            <InputGroup.Text> {item.column_name} </InputGroup.Text>
                                            <Form.Control
                                                value={empleado.item}
                                                placeholder="*12345678-9*"
                                                onChange={(e) => handleChange(item.column_name, e.target.value)}
                                            />
                                        </InputGroup>
                                    )
                                }
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
                                if (item.column_name === "correo_electronico") {
                                    return (
                                        <InputGroup className='mb-3' key={index}>
                                            <InputGroup.Text> Correo electrónico </InputGroup.Text>
                                            <Form.Control
                                                value={empleado.item}
                                                type="email"
                                                placeholder="Correo electrónico"
                                                onChange={(e) => handleChange(item.column_name, e.target.value)}
                                            />
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