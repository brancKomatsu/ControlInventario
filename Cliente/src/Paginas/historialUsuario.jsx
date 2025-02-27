import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import Servicio from '../Servicios/Servicio'
import Encabezado from '../components/Encabezado.jsx'
import dayjs from 'dayjs'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const historialUsuarios = () => {
    const [datos, setDatos] = useState([])
    const [sorting, setSorting] = useState([])
    const [filtering, setFiltering] = useState("")
    const asset = useParams().asset
    const navigate = useNavigate() 

    //Conseguir los datos de los usuarios que ha usado el dispositivo de asset
    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const respuesta = await Servicio.historialUsuarios(asset)
                setDatos(respuesta)
            } catch (error) {
                console.error("Hubo un error en la peticion de datos", error)
            }
        }
        fetchDatos()
    }, [])

    //Aqui estan los headers de cada columna
    const columns = [
        {
            header: "Indice",
            accessorFn: (row, index) => index + 1,
        },
        {
            header: "Fecha ingreso",
            accessorKey: 'fecha_ingreso',
            cell: (info) => dayjs(info.getValue()).format('DD/MM/YY')
        },
        {
            header: "Fecha eliminacion",
            accessorKey: 'fecha_eliminaicion',
            cell: (info) => {
                const fecha = dayjs(info.getValue())
                if (fecha.isValid()) {
                    return fecha.format('DD-MM-YYYY')
                } else {
                    return 'Asignado'
                }
            }
        },
        {
            header: "Persona a cargo",
            accessorKey: 'nombre',
            cell: (info) => {
                const row = info.row.original
                return `${row.nombre} ${row.apellido}`
            }
        }
    ]

    //Configuracion de la tabla utilizada con tanstack/react-Table
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
        <div className="mt-5">
            <Encabezado />
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
            </Container>
            <br />
            <Button onClick={() => navigate(-1)}> Volver atras</Button>
        </div>
    )
}

export default historialUsuarios