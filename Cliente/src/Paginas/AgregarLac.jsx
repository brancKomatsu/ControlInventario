import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import { useState, useEffect } from 'react'
import Servicio from '../Servicios/Servicio'
import { useNavigate } from 'react-router-dom'
import Encabezado from '../components/Encabezado'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const AgregarLac = () => {
	const [lac, setLac] = useState({ lac: '' })
	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const respuesta = await Servicio.subirLac(lac)
			console.log(respuesta)
			if (respuesta) {
				navigate('/Lac')
			}
		} catch (error) {
			console.error("no se pudo enviar la informacion", error)
		}
	}

	return (
		<>
			<Encabezado />
			<Card>
				<Card.Header className="border rounded">Anadir Lac</Card.Header>
				<Card.Body>
					<Form onSubmit={handleSubmit}>
						<InputGroup>
							<InputGroup.Text>Nombre Lac</InputGroup.Text>
							<Form.Control
								value={lac.lac}
								placeholder="Nombre del lac"
								onChange={(e) => { setLac(prev => ({...prev, lac:e.target.value }))}}
							/>
						</InputGroup>
						<br />
						<Row>
							<Col>
								<Button onClick={() => navigate(-1)} >Volver atras</Button>
							</Col>
							<Col>
								<Button type="Submit">Anadir Lac</Button>
							</Col>
						</Row>
					</Form>
				</Card.Body>
			</Card>
		</>
	)
}
export default AgregarLac