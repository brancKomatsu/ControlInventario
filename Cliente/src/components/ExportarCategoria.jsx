import Servicio from '../Servicios/Servicio'
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { useState, useEffect } from 'react'
import Select from 'react-select'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'

const categorias = () => {
    const [categorias, setCategorias] = useState()
    const [sorting, setSorting] = useState([])
    const [filtering, setFiltering] = useState("")
    const [datos, setDatos] = useState()
    const [options, setOptions] = useState([])
    const [seleccionCategoria, setseleccionCategoria] = useState()
    const [columns, setColumns] = useState()

    useEffect(() => {
        console.log("Se esta pidiendo informacion", seleccionCategoria)
        const fetchData = async () => {
            try {
                const respuesta = await Servicio.tablaCategoria(seleccionCategoria)
                setDatos(respuesta)
            } catch (error) {
                console.error("Hubo un error al obtener los datos: ", error)
            }
        }
        fetchData()
    }, [seleccionCategoria])

    //Mostrar seleccion de categorias
    useEffect(() => {
        const fetchData = async () => {
            try {
                const respuesta = await Servicio.categorias()
                setCategorias(respuesta)
            } catch (error) {
                console.error("Hubo un error al obtener los datos: ", error)
            }
        }
        fetchData()
    }, [])
    useEffect(() => {
        if (categorias) {
            const valores = categorias.map(item => ({
                value: `${item.nombre_tabla}`,
                label: `${item.nombre_tabla}`
            }))
            setOptions(valores)
            console.log(options)
        }
    }, [categorias])
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


    //Creacion tabla de categoria seleccionada
    useEffect(() => {
        if (datos && !columns) {
            const columnas = Object.keys(datos[0]).map(key => {
                if (key === "creacion_equipo" || key === "eliminacion_equipo") {
                    let column = {
                        header: key.toUpperCase(),
                        accessorKey: key,
                        cell: (info) => dayjs(info.getValue()).format('DD/MM/YY')
                    }
                    return column
                } else {
                    let column = {
                        header: key.toUpperCase(),
                        accessorKey: key
                    }
                    return column
                }
            })
            setColumns(columnas)
        }
    }, [datos])

    const table = useReactTable({
        data: datos || [],
        columns: columns || [],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { sorting, globalFilter: filtering },
        onSortingChange: setSorting,
        onGlobalFilteringChange: setFiltering
    })

    //Aqui se importara todo a excel
    const [sheetData, setsheetData] = useState(null)
    useEffect(() => {
        setsheetData(datos)
    }, [seleccionCategoria, datos])

    const handleExport = () => {
        const formattedData = sheetData.map(item => ({
            ...item,
            creacion_equipo: item.creacion_equipo ? dayjs(item.creacion_equipo).format('DD-MM-YYYY') : "",
            eliminacion_equipo: item.eliminacion_equipo ? dayjs(item.eliminacion_equipo).format('DD-MM-YYYY') : ""
        }))
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
        <Container className="d-flex flex-column align-items-center px-4">
            <Row>
                <Col xs="auto">
                    <InputGroup>
                        <InputGroup.Text> Seleccionar categoria a importar: </InputGroup.Text>
                        <Select options={options} styles={customStyles} onChange={(selectedOption) => setseleccionCategoria(selectedOption.value)} />
                    </InputGroup>
                </Col>
                <Col xs="auto" className="ms-auto">
                    <Button onClick={handleExport}>Exportar a Excel</Button>
                </Col>
            </Row>
            <br />
            {
                datos ?
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
                    </>
                    :
                    null
            }
        </Container>
    )
}

export default categorias