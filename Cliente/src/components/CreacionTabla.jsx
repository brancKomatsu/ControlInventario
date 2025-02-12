import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import Servicio from '../Servicios/Servicio'
import { useNavigate } from 'react-router-dom'

const MostrarFilas = ({ columnas, setColumnas }) => {
    const handleChangeNombre = (index, value) => {
        setColumnas((prev) =>
            prev.map((columna, i) =>
                i === index ? { ...columna, nombre: value } : columna
            )
        )
    }

    const handleChangeType = (index, type) => {
        setColumnas((prev) =>
            prev.map((columna, i) =>
                i === index ? { ...columna, tipo: type } : columna
            )
        )
    }
    return (
        <>
            {columnas.map((columna, index) => (
                <InputGroup className="mb-3" key={index}>
                    <InputGroup.Text>Nombre columna {index + 1} </InputGroup.Text>
                    <Form.Control
                        value={columna.nombre || ''}
                        onChange={(e) => handleChangeNombre(index, e.target.value)}
                        aria-label={`Nombre de la columna ${index + 1}`}
                    />
                    <Dropdown id="dropdown-basic-button" title="Tipo de dato">
                        <Dropdown.Toggle variant="success">
                            {columna.tipo ? columna.tipo : 'Tipo de dato' }
                        </Dropdown.Toggle>
                        <Dropdown.Menu >
                            <Dropdown.Item
                                value={columna.tipo || ''}
                                onClick={(e) => handleChangeType(index, 'int')}
                            >
                                Numero
                            </Dropdown.Item>
                            <Dropdown.Item
                                value={columna.tipo || ''}
                                onClick={(e) => handleChangeType(index, 'date')}
                            >
                                Fecha
                            </Dropdown.Item>
                            <Dropdown.Item
                                value={columna.tipo || ''}
                                onClick={(e) => handleChangeType(index, 'varchar(100)')}
                            >
                                Texto Grande (100)
                            </Dropdown.Item>
                            <Dropdown.Item
                                value={columna.tipo || ''}
                                onClick={(e) => handleChangeType(index, 'varchar(50)')}
                            >
                                Texto mediano (50)
                            </Dropdown.Item>
                            <Dropdown.Item
                                value={columna.tipo || ''}
                                onClick={(e) => handleChangeType(index, 'varchar(20)')}
                            >
                                Texto chico (20)
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </InputGroup>
            ))}
        </>
    )
    
}

const CreacionTabla = () => {
    const [columnas, setColumnas] = useState([])
    const [nombreTabla, setnombreTabla] = useState()
    const navigate = useNavigate()

    const agregarColumnas = () => {
        setColumnas((prev) =>
            [...prev, { nombre: '', tipo: '' }]
        )
    }
    const eliminarColumna = () => {
        setColumnas((prev) => {
            return prev.slice(0, prev.length - 1)
        })
    }

    const subirTabla = async (e) => {
        e.preventDefault()

        if (!nombreTabla.trim()) {
            alert('el nombre de la tabla es obligatorio')
            return
        }
        if (columnas.some(col => !col.nombre | !col.tipo)) {
            alert('Todas las columnsa deben tener nombre y tipo')
            return
        }

        const datoTabla = {
            nombre_tabla: nombreTabla,
            columnas
        }
        console.log(datoTabla)

        try {
            const respuesta = await Servicio.subirTabla(datoTabla)
            console.log(respuesta)
            alert('Tabla creada con exito')
            respuesta ? navigate("/CreacionEquipo") : null
        } catch (error) {
            console.error("Hubo error en la peticion", error)
        }
    }

    return (
        <>  
            <Form onSubmit={subirTabla}>
                <Form.Group>
                    <InputGroup>
                        <InputGroup.Text>Nombre tabla</InputGroup.Text>
                        <Form.Control
                            value={nombreTabla || ''}
                            onChange={(e) => setnombreTabla(e.target.value)}
                            aria-label={`Nombre de tabla`}
                        />
                    </InputGroup>
                    <br />
                    <MostrarFilas columnas={columnas} setColumnas={setColumnas} />
                </Form.Group>
                <br/>
                <Form.Group>
                    <ButtonGroup>
                         <Button onClick={agregarColumnas}> Anadir columna </Button >
                         <Button onClick={eliminarColumna}>Eliminar columna</Button>
                    </ButtonGroup>
                    <br />
                    <br />
                    <Button type="submit">Anadir tabla</Button>
                </Form.Group>
            </Form>
            
            
        </>
    )
}

export default CreacionTabla