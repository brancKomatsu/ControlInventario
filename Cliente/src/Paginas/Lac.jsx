import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { useState, useEffect } from 'react'
import Servicio from '../Servicios/Servicio.js'
import Encabezado from '../components/Encabezado'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { Link, useNavigate } from 'react-router-dom'

const Lac = () => {
    const [sorting, setSorting] = useState([])
    const [datos, setDatos] = useState([])
    const [filtering, setFiltering] = useState("")
    const [idLac, setidLac] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const respuesta = await Servicio.lac()
                setDatos(respuesta)
                setidLac(respuesta.id_lac)
                console.log(respuesta)
            } catch (error) {
                console.error("errros al cargar los datos", error)
            }
        }
        fetchData()
    },[])

    const columns = [
        {
            header: "Id Lac",
            accessorKey: "id_lac",
        },
        {
            header: "Nombre Lac",
            accessorFn: (row) => ({ id_lac: row.id_lac, nombre_lac: row.nombre_lac}),
            cell: (info) => {
                const { nombre_lac, id_lac } = info.getValue()
                return (
                    <Link to={`/Lac/${nombre_lac}/${id_lac}`} title="Editar este Lac">
                        {nombre_lac}
                    </Link>
                )
            }
        },
	]

	const table = useReactTable({
        data: datos,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: { sorting, globalFilter: filtering },
		onSortingChange: setSorting,
		onGlobalFilteringChange: setFiltering
	})

	return (
		<>
			<Encabezado />
            <Form>
                <Row>
                    <Col xs={7}>
                        <InputGroup>
                            <InputGroup.Text>Buscador global</InputGroup.Text>
                            <Form.Control
                                placeholder="Ingresar valor para buscar"
                                value={filtering}
                                onChange={(e) => setFiltering(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </Row>
            </Form>
            <br />
            <Table striped bordered size="lg" responsive="sm">
                <thead>
                    {
                        table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {
                                    headerGroup.headers.map(header => (
                                        <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                            {header.column.columnDef.header}{' '}
                                            {header.column.getIsSorted() === 'asc' ? '⬆' : header.column.getIsSorted() === 'desc' ? '⬇' : ''}

                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
                <tbody>
                    {
                        table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {
                                    row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </Table>

            <Container fluid>
                <Row>
                    <Col>
                        <Button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                            <span>
                                primera pagina
                            </span>
                        </Button>
                    </Col>
                    <Col>
                        <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            <span>
                                pagina anterior
                            </span>
                        </Button>
                    </Col>
                    <Col>
                        <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            <span>
                                pagina siguiente
                            </span>
                        </Button>
                    </Col>
                    <Col>
                        <Button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                            <span>
                                ultima pagina
                            </span>
                        </Button>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Button as={Link} to="/AgregarLac" >Agregar Lac</Button>
                </Row>
            </Container>
            <br />
            <Button onClick={() => navigate(-1)}> Volver atras</Button>
		</>
	)
}
export default Lac