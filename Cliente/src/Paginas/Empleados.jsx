import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import Servicio from '../Servicios/Servicio'
import { useEffect, useState } from 'react'
import Encabezado from '../components/Encabezado'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { Link, useNavigate } from 'react-router-dom'

const Empleados = () => {
    const [datos, setDatos] = useState([])
    const [sorting, setSorting] = useState([])
    const [user, setUser] = useState()
    const [filtering, setFiltering] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const storedUser = JSON.parse(sessionStorage.getItem("usuario"))
            if (storedUser) {
                setUser(storedUser)
            } else {
                setUser(null)
            }

            try {
                const respuesta = await Servicio.datoEmpleados()
                console.log(respuesta.data)
                if (respuesta) {
                    setDatos(respuesta.data)
                } else {
                    console.log("Hubo un error")
                }
            } catch (error) {
                console.error("Hubo error al conseguir valores de empleados")
            }
        }
        fetchData()
    }, [])

    const columns = [
        {
            header: "Indice",
            accessorFn: (row, index) => index + 1,
        },
        {
            header: 'Rut',
            accessorKey: 'rut',
            cell: (info) => { 
                return user ? (
                            <Link to={`/Empleado/${info.getValue()}`} title="Eliminar el empleado">
                                {info.getValue()}
                            </Link>
                        )
                        :
                        (
                            <span>{info.getValue()}</span>
                        )
            }
        },
        {
            header: 'Nombre',
            accessorKey: 'nombre'
        },
        {
            header: 'Apellido',
            accessorKey: 'apellido'
        },
        {
            header: 'Lac',
            accessorKey: 'lac'
        },
        {
            header: 'Correo electronico',
            accessorKey: 'correo_electronico'
        },
        {
            header: 'Estado',
            accessorKey: 'estado'
        }
    ]

    const table = useReactTable({
        data: datos,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting, globalFilter: filtering },
        onSortingChange: setSorting,
        onGlobalFilteringChange: setFiltering
    })

    return (
        <>
            <Encabezado />
            <Form>
                <InputGroup>
                    <InputGroup.Text>Buscador global</InputGroup.Text>
                    <Form.Control
                        placeholder="Ingresar valor para buscar"
                        value={filtering}
                        onChange={(e) => setFiltering(e.target.value)}
                    />
                </InputGroup>
            </Form>
            <br/>
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
                <br />
                <Row>
                    {user && (
                        <Button>
                            <Link style={{ color: 'white' }} to="/agregarEmpleado" title="Agregar un empleado a la tabla">Agregar empleado</Link>
                        </Button>
                    )}
                </Row>
                <br />
                <Button onClick={() => navigate(-1)}> Volver atras</Button>
            </Container>
        </>
    )
}

export default Empleados