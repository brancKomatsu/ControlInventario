import { Link, useNavigate, useParams } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import Encabezado from '../components/Encabezado'
import Servicio from '../Servicios/Servicio'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const EditarLac = () => {
	const lac = useParams().lac
	const id_lac = useParams().id
	const [valor, setValor] = useState({ nuevo: '', id_lac: id_lac })
	const [eliminar, setEliminar] = useState(false)
	const navigate = useNavigate()
	console.log(eliminar)

	const eliminarLac = async (e) => {
		e.preventDefault()
		if (window.confirm("¿Estas seguro que quieres eliminar el Lac? \n Esto desactivara los equipos y empleados relacionados a este Lac")) {
			console.log("El usuario confirmo")
			const respuesta = await Servicio.eliminarLac(valor)
			if (respuesta) {
				navigate('/Lac')
			}
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (valor.nuevo === "") {
			window.alert("Es necesario agregar un nuevo valor")
			return
		} else {
			try {
				const respuesta = await Servicio.actualizarLac(valor)
				console.log(respuesta)
				if (respuesta) {
					navigate('/Lac')
				}
			} catch (error) {
				console.error("no se pudo enviar la informacion", error)
			}
		}
	}

	return (
		<>
			<Encabezado />
			<Card>
				<Card.Header className="border rounded">
					<h2>
						Cambiar nombre Lac: {lac}
					</h2>
				</Card.Header>
				<Card.Body>
					<Form onSubmit={handleSubmit}>
						<InputGroup>
							<InputGroup.Text>Nombre Lac</InputGroup.Text>
							<Form.Control
								value={valor.nuevo}
								placeholder="Ingrese nuevo nombre de Lac"
								onChange={(e) => { setValor(prev => ({ ...prev, nuevo: e.target.value })) }}
							/>
						</InputGroup>
						<br />
						<Row>
							<Col>
								<Button onClick={eliminarLac} > ELiminar Lac</Button>
							</Col>
							<Col>
								<Button type="Submit">Editar lac</Button>
							</Col>
						</Row>
						<br/>
						<Row>
							<Col>
								<Button onClick={() => navigate(-1)} >Volver atras</Button>
							</Col>
						</Row>
					</Form>
				</Card.Body>
			</Card>
		</>
	)
}

export default EditarLac