import express from 'express'
import cors from 'cors'
import productsRoutes from './routes/movimientos.routes.js'

const app = express()
const corsOptions = {
    origin: ("http://172.20.2.5:51915")
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(productsRoutes)

app.listen(8080, () => {
    try {
        console.log("servidor iniciado en puerto 8080")
    } catch (error) {
        console.error(error)
    }
})