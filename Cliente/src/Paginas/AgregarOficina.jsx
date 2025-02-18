import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import { useState, useEffect } from 'react'
import Servicio from '../Servicios/Servicio'
import { useNavigate } from 'react-router-dom'
import Encabezado from '../components/Encabezado'
import Select from 'react-select'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const agregarOficina = () => {
	const [options, setOptions] = useState({})
	const [pais, setPais] = useState()
	const [dato, setDato] = useState({ oficina: '', pais: '' })
	const navigate = useNavigate()

	useEffect(() => {
		const fecthDatos = async () => {
			const pais = await Servicio.paises()
			console.log("Las nombres de los paises son: ", pais)
			setPais(pais)
		}
		fecthDatos()
	}, [])

	useEffect(() => {
		if (pais) {
			const valores = pais.map(item => ({
				value: item.nombre_pais,
				label: `${item.nombre_pais}`
			}))
			setOptions(valores)
			console.log(options)
		}
	}, [pais])

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

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (dato.oficina === '' && dato.pais === '') {
			window.alert("Es necesario rellenar todo")
			return
		}
		try {
			const respuesta = await Servicio.agregarOficina(dato)
			console.log(respuesta)
			respuesta ? navigate('/Oficinas') : null
		} catch (error) {
			console.error("Hubo un error al agregar la oficina", error)
		}
		console.log("Se ha hecho submit")
	}
	return (
		<>
			<Encabezado />
			<Card>
				<Card.Header className="border rounded">Anadir oficina</Card.Header>
				<Card.Body>
					<Form onSubmit={handleSubmit} >
						<InputGroup>
							<InputGroup.Text>Nombre oficina</InputGroup.Text>
							<Form.Control
								value={dato.oficina}
								placeholder="Nombre de oficina"
								onChange={(e) => setDato(prev => ({ ...prev, oficina: e.target.value }))}
							/>
						</InputGroup>
						<br />
						<InputGroup>
							<InputGroup.Text>Pais</InputGroup.Text>
							<Select options={options} styles={customStyles} onChange={(selectedOption) => setDato(prev => ({ ...prev, pais: selectedOption.value }))} />
						</InputGroup>
						<br />
						<Row>
							<Col>
								<Button onClick={() => navigate(-1)} >Volver atras</Button>
							</Col>
							<Col>
								<Button type="Submit">Anadir oficina</Button>
							</Col>
						</Row>
					</Form>
				</Card.Body>
			</Card>
		</>
	)
}
export default agregarOficina