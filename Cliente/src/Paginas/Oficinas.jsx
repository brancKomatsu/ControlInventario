import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import Servicio from '../Servicios/Servicio.js'
import Encabezado from '../components/Encabezado.jsx'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Oficinas = () => {
    const [sorting, setSorting] = useState([])
    const [datos, setDatos] = useState([])
    const [filtering, setFiltering] = useState("")
    const navigate = useNavigate()

    //Verificar si el usuario a iniciado sesion al ingresar a esta pagina
    useEffect(() => {
        if (!sessionStorage.getItem("usuario")) navigate('/home')
    }, [])

    //Obtencion de informacion de las oficinas
    useEffect(() => {
        const fetchData = async () => {
            try {
                const respuesta = await Servicio.oficinas()
                setDatos(respuesta)
                console.log(respuesta)
            } catch (error) {
                console.error("errros al cargar los datos", error)
            }
        }
        fetchData()
    }, [])

    //Headers de las tablas
    const columns = [
        {
            header: "Id oficina",
            accessorKey: "id_oficina",
        },
        {
            header: "Nombre oficina",
            accessorFn: (row) => ({ id_oficina: row.id_oficina, nombre_oficina: row.nombre_oficina }),
            cell: (info) => {
                const { nombre_oficina, id_oficina } = info.getValue()
                return (
                    <Link to={`/oficina/${nombre_oficina}/${id_oficina}`} title="Editar esta oficina">
                        {nombre_oficina}
                    </Link>
                )
            }
        },
        {
            header: "País",
            accessorKey: "nombre_pais"
        }
    ]

    //Funcion para filtrar lo que escriba el usuario en el buscador global
    const filtrarPorSecuencia = (row, filter) => {
        if (!filter) return datos
        //console.log(row,filter)
        for (let letra of filter) {
            if (!letra) break
            let palabraEncontrada = false

            for (let cell of row.getVisibleCells()) {

                const cellValue = cell.getValue()?.toString().toLowerCase()
                if (!cellValue) continue

                let filterIndex = 0
                for (let char of cellValue) {

                    if (char === letra[filterIndex]) {
                        filterIndex++
                    } else {
                        break
                    }

                    if (filterIndex === letra.length) {
                        palabraEncontrada = true
                        break
                    }
                }
                if (palabraEncontrada) break
            }
            if (!palabraEncontrada) return false
        }
        return true
    }

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
        onGlobalFilteringChange: setFiltering,
        globalFilterFn: (row, columnId, filterValue) => {
            const filterLower = filterValue.toLowerCase().split(',')
            return filtrarPorSecuencia(row, filterLower)
        }
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
                    <Button as={Link} to="/AgregarOficinas" >Agregar oficina</Button>
                </Row>
            </Container>
            <br />
            <Button onClick={() => navigate(-1)}> Volver atras</Button>
        </>
    )
}
export default Oficinas