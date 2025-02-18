import sql from 'mssql'

const dbSettings = {
    user: "sa",
    password: `Modular2025..!!`,
    server: `VM-INV-MMS\\DB`,
    database: "Control_Inventario",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

export const getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings)
        return pool
    } catch (error) {
        console.error("hubi error en la conexion de la base de datos", error)
    }
}