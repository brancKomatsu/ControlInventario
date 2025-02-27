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
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import * as XLSX from 'xlsx'

const PaginaPrincipal = () => {
    const navigate = useNavigate()

    const [datos, setDatos] = useState([])
    const [sorting, setSorting] = useState([])
    const [filtering, setFiltering] = useState("")
    const [filasFiltradas, setfilasFiltradas] = useState()

    //Utilidades de dayjs para obtener fecha en UTC
    dayjs.extend(utc)
    dayjs.extend(timezone)

    //Funcion para obtener los datos de todos los equipos existentes
    useEffect(() => {
        const fetchData = async () => {
            if (datos.length > 0) return
            try {
                const respuesta = await Servicio.verEquipos()
                const respuesta_final = respuesta.data.flat()
                setDatos(respuesta_final)
                setfilasFiltradas(respuesta_final)
                console.log(respuesta_final)
            } catch (error) {
                console.log("errros al cargar los datos", error)
            }
        }

        fetchData()
    }, [])

    //Aqui estan los headers de cada columna
    const columns = [
        {
            header: "Índice",
            accessorFn: (row, index) => index + 1,
        },
        {
            header: "Categoría",
            accessorKey: 'Categoria',
        },
        {
            header: "Asset",
            accessorKey: 'Asset',
            cell: (info) => (
                <Link to={`/equipo/${info.getValue()}`} title="Mas opciones para equipo">
                    {info.getValue()}
                </Link>
            )
        },
        {
            header: "Service tag",
            accessorKey: 'Service tag',
        },
        {
            header: "Ubicación",
            accessorKey: 'Ubicación'
        },
        {
            header: "Lac",
            accessorKey: 'Lac'
        },
        {
            header: "Alias",
            accessorKey: 'Alias',
        },
        {
            header: "Persona a cargo",
            accessorKey: 'Persona a cargo'
        },
        {
            header: "Ultima modificación",
            accessorKey: 'Ultima modificación',
            cell: (info) => dayjs.utc(info.getValue()).format('DD/MM/YY')
        },
        {
            header: "Estado",
            accessorKey: 'Estado'
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
        onGlobalFilterChange: setFiltering,
        globalFilterFn: (row, columnId, filterValue) => {
            const filterLower = filterValue.toLowerCase().split(',')
            return filtrarPorSecuencia(row, filterLower)
        }
    })

    //<---------------- Manejo exportacionExcel ---------------->
    //--> Conseguir la información filtrada para exportar a Excel
    useEffect(() => {
        const aux = table.getFilteredRowModel().rows
        const filtrado = aux.map((item, index) => {
            return item.original
        })
        setfilasFiltradas(filtrado)
        console.log("Las filas filtradas son: ", filasFiltradas)
    }, [filtering])

    //--> Aqui se importara todo a excel
    const [sheetData, setsheetData] = useState(null)
    useEffect(() => {
        setsheetData(filasFiltradas)
    }, [filasFiltradas])

    //--> Funcion para exportacion a excel
    const handleExport = () => {
        const formattedData = sheetData.map(item => ({
            ...item,
            'Creacion equipo': item['Creacion equipo'] ? dayjs(item['Creacion equipo']).format('DD-MM-YYYY') : "",
            'Eliminacion equipo': item['Eliminacion equipo'] ? dayjs(item['Eliminacion equipo']).format('DD-MM-YYYY') : "",
            'Documento firmado': item['Documento firmado'] ? 'Si' : 'No'
        }));
        console.log(formattedData)

        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(formattedData)

        const columnWidths = Object.keys(formattedData[0]).map((key) => {
            let maxLength = key.length

            formattedData.forEach(item => {
                if (item[key]) {
                    const cellLength = String(item[key]).length
                    maxLength = Math.max(maxLength, cellLength)
                }
            })

            return { wch: maxLength };
        })
        ws['!cols'] = columnWidths


        const range = XLSX.utils.decode_range(ws['!ref']);
        ws['!autofilter'] = { ref: XLSX.utils.encode_range(range) }

        XLSX.utils.book_append_sheet(wb, ws, "TablaCategoria")
        XLSX.writeFile(wb, "TablaCategoria.xlsx")
    }

    return (
        <>
            <Encabezado />
            <Form>
                <Row>
                    <Col xs={7}>
                        <InputGroup>
                            <InputGroup.Text>Buscador global</InputGroup.Text>
                            <Form.Control
                                placeholder="Ingresar valores separados por comas y sin espacio"
                                value={filtering}
                                onChange={(e) => setFiltering(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col xs="auto" className="ms-auto">
                        <Button onClick={handleExport}> Exportar tabla actual </Button>
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
            </Container>
            <br />
            <Button onClick={() => navigate('/home')}> Volver atras</Button>
        </>
    )
}

export default PaginaPrincipal