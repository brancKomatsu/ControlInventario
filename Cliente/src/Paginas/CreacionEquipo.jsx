import Encabezado from "../components/Encabezado"
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Card from 'react-bootstrap/Card'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import { useState, useEffect } from 'react'
import Servicio from '../Servicios/Servicio'
import { Link, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import CreacionTabla from "../components/CreacionTabla"
import Select from 'react-select'

//Componente para poder generar el form para ingresar dato a tabla
const CreacionDato = ({ columnas, valores, setValores, asset, setAsset, service, setService, setvalorLac }) => {
    const [options, setOptions] = useState({})
    const [lac, setLac] = useState()

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

    useEffect(() => {
        const fecthDatos = async () => {
            const lac = await Servicio.lac()
            console.log("Las nombres de los lac son: ", lac)
            setLac(lac)
        }
        fecthDatos()
    }, [])

    useEffect(() => {
        if (lac) {
            console.log("EL lac es: ", lac)
            const valores = lac.map(item => ({
                value: item.nombre_lac,
                label: `${item.nombre_lac}`
            }))
            setOptions(valores)
            console.log(options)
        }
    }, [lac])

    const handleChange = (columnas, index, value) => {
        setValores((prev) => {
            const valoresNuevos = [...prev]
            valoresNuevos[index] = { ...valoresNuevos[index], [columnas]: value }
            return valoresNuevos
        })
    }

    const handleNumber = (e) => {
        if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
            e.preventDefault()
        }
    }
    
    return (
        <>
            <InputGroup className='mb-3'>
                <InputGroup.Text> Service tag </InputGroup.Text>
                <Form.Control
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                />
            </InputGroup>
            <InputGroup className='mb-3'>
                <InputGroup.Text> Asset </InputGroup.Text>
                <Form.Control
                    value={asset}
                    onChange={(e) => setAsset(e.target.value)}
                    onKeyDown={handleNumber}
                />
            </InputGroup>
            <InputGroup className='mb-3'>
                <InputGroup.Text> Lac </InputGroup.Text>
                <Select options={options} styles={customStyles} onChange={(selectedOption) => setvalorLac(selectedOption.value)} />
            </InputGroup>
            {
                columnas.map((item, index) => (
                    <InputGroup className='mb-3' key={index}>
                        <InputGroup.Text> {item.column_name} </InputGroup.Text>
                        <Form.Control
                            value={valores[index]?.[item.column_name] || ''}
                            placeholder={valores[index] || '' }
                            onChange={(e) => handleChange(item.column_name, index, e.target.value) }
                        />
                    </InputGroup>
                )) 
            }
        </>
    )
}

const CreacionEquipo = () => {
    const [tabla, setTabla] = useState(false) //si es true muestra el form para crear una tabla, en caso contrario no muestra nada
    const navigate = useNavigate()

    //para mostrar los nombres de las tablas en el dropdown
    const [categorias, setCategorias] = useState()
    useEffect(() => {
        const fecthCategorias = async () => {
            const datos = await Servicio.creacionEquipo()
            //console.log(datos)
            setCategorias(datos)
        }
        fecthCategorias()
    }, [])

    //para mostrar las columnas de la tabla seleccionada
    const [columnas, setColumnas] = useState() // -> contiene los valores de las columnas de la tabla
    const [nombre_tabla, setNombre_tabla] = useState() // -> contiene el nombre de la tabla
    //console.log(nombre_tabla)
    useEffect(() => {
        const fecthColumnas = async () => {
            const datos = await Servicio.columnasTabla(nombre_tabla)
            setColumnas(datos)
        }
        fecthColumnas()
    }, [nombre_tabla])
    //console.log("valor de la tabla escogida: ", nombre_tabla)
    //console.log('valores de las columnas', columnas)

    //Aqui se va a controlar el submit
    const [valores, setValores] = useState([]) //contiene las caracteristicas de la tabla seleccionada
    const [asset, setAsset] = useState() //valor del asset
    const [service, setService] = useState() // valor del service tag
    const [valorLac, setvalorLac] = useState()
    const fecha = dayjs()

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(asset, service)
        if (!asset || !service) {
            window.alert("asset y service tag tienen que tener un valor")
            return null
        }
        
        const datoAsubir = {
            nombre_tabla:nombre_tabla,
            asset: asset,
            service: service,
            fecha_creacion: fecha.format('YYYY-MM-DD'),
            lac: valorLac,
            valores
        }
        try {
            console.log("los datos a subir son: ", datoAsubir)
            
            const respuesta = await Servicio.subirEquipo(datoAsubir)
            console.log(respuesta)
            if (respuesta) {
                navigate("/verEquipos")
            } else {
                window.alert(respuesta)
            }
            
        } catch (error) {
            console.error("Hubo error al realizar la solicitud", error)
        }
    }

    return (
        <>
            <Encabezado />
            <Card>
                <Card.Header className="border rounded">
                    <Dropdown>
                        <Dropdown.Toggle variant="Primary" id="dropdown-basic">

                            {/* si nombre tabla no tiene valor mostrara 'categoria equipo' en caso contrario mostrara el valor escogido */}
                            {nombre_tabla ? nombre_tabla : 'Categoria equipo'}

                        </Dropdown.Toggle>

                        <Dropdown.Menu>

                            {/* se itera sobre todos los valores que tiene categoria  para escoger la tabla a la que se quiere ingresar un dato */}
                            {
                                categorias && (
                                    categorias.map((item, index) => {
                                        return (
                                            <Dropdown.Item key={index} onClick={() => { setNombre_tabla(item.TABLE_NAME); setTabla(false) }}>{item.TABLE_NAME}</Dropdown.Item>
                                        )
                                    })
                                )
                            }
                            <Dropdown.Divider />

                            {/* Este boton sirve para cuando el usuario quiera agregar una tabla */ }
                            <Dropdown.Item onClick={() => { setTabla(true); setNombre_tabla(false) }}>+ Anadir categoria</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Card.Header>
                <Card.Body>
                    {/* Aqui se crea el formulario para crear un dato a insertar */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            {
                                nombre_tabla ?
                                    <CreacionDato
                                        columnas={columnas}
                                        valores={valores}
                                        setValores={setValores}
                                        asset={asset}
                                        setAsset={setAsset}
                                        service={service}
                                        setService={setService}
                                        setvalorLac={setvalorLac}
                                    /> :
                                    null
                            }
                        </Form.Group>
                        <Form.Group>
                            {/* En caso de que se haya escogido alguna tabla para agregar dato se muestra el boton, en caso contrario no muestra nada */}
                            { nombre_tabla ? <Button type="submit">Crear equipo</Button> : null }
                        </Form.Group>
                    </Form>
                    {tabla ? <CreacionTabla /> : null}
                    <br />
                    <Button onClick={() => navigate(-1)}> Volver atras</Button>
                </Card.Body>
            </Card>
        </>
    )
}

export default CreacionEquipo