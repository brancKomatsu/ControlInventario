import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import Servicio from '../Servicios/Servicio.js'
import Encabezado from '../components/Encabezado.jsx'
import dayjs from 'dayjs'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Categorias from '../components/ExportarCategoria.jsx'

const PaginaPrincipal = () => {
    const [sorting, setSorting] = useState([])
    const [datos, setDatos] = useState([]) 
    const [filtering, setFiltering] = useState("")
    const [user, setUser] = useState()
    const [filtroCategoria, setfiltroCategoria] = useState(false)
    const navigate = useNavigate() 

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("usuario"))
        if (storedUser) {
            setUser(storedUser)
        } else {
            setUser(null)
        }

        const fetchData = async () => {
            if(datos.length > 0) return
            try {
                const respuesta = await Servicio.verEquipos()
                setDatos(respuesta.data)
                console.log(respuesta.data)
            } catch (error) {
                console.log("errros al cargar los datos", error)
            }
        }

        fetchData()
    }, [])

    console.log(datos)


    //Aqui tiene que estar los headers de cada columna
    const columns = [
        {
            header: "Indice",
            accessorFn: (row, index) => index + 1,
        },
        {
            header: "Categoria",
            accessorKey: 'categoria',
        },
        {
            header: "Asset",
            accessorKey: 'asset',
            cell: (info) => (
                <Link to={`/equipo/${info.getValue()}`} title="Mas opciones para equipo">
                    { info.getValue() }
                </Link>
            )
        },
        {
            header: "Service tag",
            accessorKey: 'service_tag',
        },
        {
            header: "Ubicacion",
            accessorKey: 'nombre_oficina'
        },
        {
            header: "Lac",
            accessorKey: 'nombre_lac'
        },
        {
            header: "Alias",
            accessorKey: 'alias',
        },
        {
            header: "Persona a cargo",
            accessorFn: (row) => `${row.nombre} ${row.apellido}`,
        },
        {
            header: "Ultima modificacion",
            accessorKey: 'ultima_modificacion',
            cell: (info) => dayjs(info.getValue()).format('DD/MM/YY')
        },
        {
            header: "Estado",
            accessorKey: 'estado'
        }
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
                        {
                            filtroCategoria ?
                                null
                                :
                                <InputGroup>
                                    <InputGroup.Text>Buscador global</InputGroup.Text>
                                    <Form.Control
                                        placeholder="Ingresar valor para buscar"
                                        value={filtering}
                                        onChange={(e) => setFiltering(e.target.value)}
                                    />
                                </InputGroup>

                        }
                    </Col>
                    <Col xs="auto" className="ms-auto">
                        <Button onClick={() => setfiltroCategoria(!filtroCategoria)}> {!filtroCategoria ? "Filtrar por categoria y exportar" : "Volver atras"} </Button>
                    </Col>
                </Row>
            </Form>
            <br />
            {
                filtroCategoria ?
                    <Categorias />
                    :
                    <>
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
                                                row.getVisibleCells().map( (cell) => (
                                                    <td key={ cell.id }>
                                                        { flexRender( cell.column.columnDef.cell, cell.getContext() ) }
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
                                    <Button onClick={() => table.setPageIndex(0)} disabled={ !table.getCanPreviousPage() }>
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
                        </Container>
                        <br />
                        <Button onClick={() => navigate(-1)}> Volver atras</Button>
                    </>
            }
        </>
    )
}

export default PaginaPrincipal