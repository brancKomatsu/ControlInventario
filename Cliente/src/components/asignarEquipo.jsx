import { useState, useEffect } from 'react'
import Servicio from '../Servicios/Servicio'
import Form from 'react-bootstrap/Form'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import Select from 'react-select'
import InputGroup from 'react-bootstrap/InputGroup'
import { useParams, useNavigate } from 'react-router-dom'

const asignarEquipo = () => {
    const [accion, setAccion] = useState()
    const asset = useParams()
    const navigate = useNavigate()

    //Verificar si se ha inciaado sesion para ingresar a la pagina
    useEffect(() => {
        if (!sessionStorage.getItem("usuario")) navigate('/home')
    }, [])

    //Aqui se maneja la asignacion del equipo
    const AccionPersona = () => {
        const [persona, setPersona] = useState()
        const [options, setOptions] = useState({})
        const [valor, setValor] = useState({})

        //Conseguir los nombres de los usuarios exitentes
        useEffect(() => {
            const fetchData = async () => {
                const respuesta = await Servicio.nombreApellido()
                setPersona(respuesta)
                console.log(respuesta)
            }
            fetchData()
        }, [])

        //Manejo de la informacion persona para mostrar en seleccion
        useEffect(() => {
            if (persona) {
                const valores = persona.map(item => ({
                    value: {
                        nombre: `${item.nombre}`,
                        apellido: `${item.apellido}`
                    },
                    label: `${item.nombre} ${item.apellido}`
                }))
                setOptions(valores)
                console.log(options)
            }
        }, [persona])

        //Estilos de seleccion
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

        console.log(valor)

        //Funcion para subir la informacion
        const handleSubmit = async (e) => {
            e.preventDefault()
            if (valor.nombre === undefined) {
                window.alert("Es necesario escoger una persona")
                return
            } else {
                window.location.reload()
            }
            try {
                const respuesta = await Servicio.asignarUsuario(valor)
                console.log(respuesta)
            } catch (error) {
                console.error("Hubo un error al asignar el usuario", error)
            }
        }

        return (
            <Form onSubmit={handleSubmit}>
                <InputGroup>
                    <InputGroup.Text> Seleccionar persona: </InputGroup.Text>
                    <Select options={options} styles={customStyles} onChange={(selectedOption) => setValor({ asset: asset.asset, nombre: selectedOption.value.nombre, apellido: selectedOption.value.apellido})} />
                </InputGroup>
                <br/>
                <Button type="submit" title="Asignar el equipo a persona"> Asignar Persona </Button>
            </Form>
        )
    }

    //Aqui se maneja la accion de crear mantenimiento
    const AccionMantenimiento = () => {
        const [texto, setTexto] = useState({texto: "", asset:asset.asset})
        //Funcion para subir la informacion a base de datos
        const handleSubmit = async (e) => {
            console.log(texto)
            if (texto.texto === "") {
                window.alert("Es necesario agregar un texto")
            }
            try {
                const respuesta = await Servicio.crearMantenimiento(texto)
                console.log(respuesta)
                window.location.reload()
            } catch (error) {
                console.erro("Hubo un error en el envio de datos", error)
            }
        }

        return (
            <>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <InputGroup.Text>Escribir causa</InputGroup.Text>
                        <Form.Control as="textarea" aria-label="With textarea" onChange={(e) => setTexto(prev => ({...prev,  texto:e.target.value })) } />
                    </InputGroup>
                    <br/>
                    <Button type="submit" title="Llevar el quipo a mantenimiento"> Realizar mantenimiento </Button>
                </Form>
            </>
        )
    }

    return (
        <>
            <ButtonGroup>
                <Button disabled> Que quiere hacer</Button>
                <DropdownButton as={ButtonGroup} title={accion} id="bg-nested-dropdown">
                    <Dropdown.Item eventKey="1" onClick={() => setAccion('Persona') } title="Asignar el equipo a una persona"> Asignar persona </Dropdown.Item>
                    <Dropdown.Item eventKey="1" onClick={() => setAccion('Mantenimiento')} title="Asignar el equipo a mantenimiento"> Mantenimiento </Dropdown.Item>
                </DropdownButton>
            </ButtonGroup>
            <br />
            <br/>
            {
                accion === 'Persona' ?
                    <AccionPersona />
                    :
                    null
            }
            {
            accion === "Mantenimiento" ?
                <AccionMantenimiento /> 
                :
                null
            }
        </>
    )
}

export default asignarEquipo