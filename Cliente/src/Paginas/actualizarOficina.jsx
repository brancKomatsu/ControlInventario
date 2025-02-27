import { useNavigate, useParams } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import { useState, useEffect } from 'react'
import Servicio from '../Servicios/Servicio'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Select from 'react-select'
import Encabezado from '../components/Encabezado'

const actualizarOficina = () => {
	const [options, setOptions] = useState([])
	const [pais, setPais] = useState()
	const id_oficina = useParams().id
	const navigate = useNavigate()
	const [oficina, setOficina] = useState({id_oficina:id_oficina})
	console.log(id_oficina)

	//Verificar si se ha iniciado sesion para ingresar a la pagina
	useEffect(() => {
		if (!sessionStorage.getItem("usuario")) navigate('/home')
	}, [])

	//Obtener los nombres de los paises
	useEffect(() => {
		const fecthDatos = async () => {
			const pais = await Servicio.paises()
			//console.log("Las nombres de los paises son: ", pais)
			setPais(pais)
		}
		fecthDatos()
	}, [])

	//Manejar paises para seleccion
	useEffect(() => {
		if (pais) {
			const valores = pais.map(item => ({
				value: item.nombre_pais,
				label: `${item.nombre_pais}`
			}))
			setOptions(valores)
			//console.log(options)
		}
	}, [pais])

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

	//Obtener los datos de la oficina con el asset
	useEffect(() => {
		const fecthDatos = async () => {
			const datoOficina = await Servicio.oficinaUnica(id_oficina)
			console.log("Los datos de la oficina son: ", datoOficina[0])
			setOficina(prev => ({ ...prev, ...datoOficina[0]}) )
		}
		fecthDatos()
	}, [])

	//Manejar subir la informacion a la base de datos
	const handleSubmit = async (e) => {
		e.preventDefault()
		console.log(oficina)
		try {
			const respuesta = await Servicio.actualizarOficina(oficina)
			console.log(respuesta)
			respuesta ? navigate('/Oficinas') : null
		} catch (error) {
			console.error("Hubo un error al actualizar la informacion", error)
		}
	}

	//Funcion para eliminar el equipo
	const eliminar = async (e) => {
		e.preventDefault()
		console.log(id_oficina)
		try {
			const respuesta = await Servicio.eliminarOficina({ id_oficina: id_oficina })
			console.log(respuesta)
			respuesta ? navigate('/Oficinas') : null
		} catch (error) {
			console.error("Hubo un error al actualizar la informacion", error)
		}
	}

	return (
		<>
			<Encabezado />
			<Card>
				<Card.Header className="border rounded">
					<h2>
						Actualizar oficina: 
					</h2>
				</Card.Header>
				<Card.Body>
					<Form onSubmit={handleSubmit} >
						<InputGroup>
							<InputGroup.Text>Nombre oficina</InputGroup.Text>
							<Form.Control
								value={oficina?.nombre_oficina}
								onChange={(e) => { setOficina(prev => ({ ...prev, nombre_oficina: e.target.value })) }}
								placeholder="Ingrese nuevo nombre de oficina"
							/>
						</InputGroup>
						<br />
						<InputGroup>
							<InputGroup.Text>Pais</InputGroup.Text>
							<Select
								options={options}
								styles={customStyles}
								value={options.find(option => option.value === oficina?.nombre_pais)}
								onChange={(selectedOption) => setOficina(prev => ({ ...prev, nombre_pais: selectedOption.value }))}
							/>
						</InputGroup>
						<br />
						<br />
						<Row>
							<Col>
								<Button onClick={eliminar} > ELiminar oficina</Button>
							</Col>
							<Col>
								<Button type="Submit">Editar oficina</Button>
							</Col>
						</Row>
						<br />
						<Row>
							<Col>
								<Button onClick={() => navigate('/Oficinas')} >Volver atras</Button>
							</Col>
						</Row>
					</Form>
				</Card.Body>
			</Card>
		</>
	)
}
export default actualizarOficina