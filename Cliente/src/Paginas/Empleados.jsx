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

    //Verificar si se ha iniciado sesion y ademas obtener informacion de los empleados ingresados al sistema
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

    //Aqui estan los headers de cada columna
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
                            <Link to={`/Usuario/${info.getValue()}`} title="Eliminar el empleado">
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
            header: 'Oficina',
            accessorKey: 'oficina'
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

    //Configuracion de la tabla utilizada con tanstack/react-Table
    const table = useReactTable({
        data: datos,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting, globalFilter: filtering },
        onSortingChange: setSorting,
        onGlobalFilteringChange: setFiltering,
        globalFilterFn: (row, columnId, filterValue) => {
            const filterLower = filterValue.toLowerCase().split(',')
            return filtrarPorSecuencia(row, filterLower)
        }
    })

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

    return (
        <>
            <Encabezado />
            <Form>
                <InputGroup>
                    <InputGroup.Text>Búscador global</InputGroup.Text>
                    <Form.Control
                        placeholder="Ingresar valór para buscar"
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
                                primera página
                            </span>
                        </Button>
                    </Col>
                    <Col>
                        <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            <span>
                                página anterior
                            </span>
                        </Button>
                    </Col>
                    <Col>
                        <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            <span>
                                página siguiente
                            </span>
                        </Button>
                    </Col>
                    <Col>
                        <Button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                            <span>
                                última página
                            </span>
                        </Button>
                    </Col>
                </Row>
                <br />
                <Row>
                    {user && (
                        <Button>
                            <Link style={{ color: 'white' }} to="/agregarUsuario" title="Agregar un empleado a la tabla">Agregar Usuario</Link>
                        </Button>
                    )}
                </Row>
                <br />
                <Button onClick={() => navigate(-1)}> Volver atrás</Button>
            </Container>
        </>
    )
}

export default Empleados