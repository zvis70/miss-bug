import express from 'express'
import cors from 'cors'

//import { bugService } from './api/bug/bug.service.js'
import { loggerService } from './services/logger.service.js'
import cookieParser from 'cookie-parser'

const app = express()


const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())


import {bugRoutes} from './api/bug/bug.routes.js'
import {userRoutes} from './api/user/user.routes.js'


app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)



app.get('/puki', (req, res) => {
    let visitCount = +req.cookies.visitCount
    console.log(visitCount);
    res.cookie('visitCount', visitCount + 1 || 1)
    //res.cookie('visitCount', 1)
    res.send(`<h1>Hi Puki</h1>`)
})


app.get('/', (req, res) => res.send('Hello there'))

app.get('/test', (req, res) => res.send('Hello there'))


const port = process.env.PORT || 3000;
app.listen(port, () => {
console.log(`App listening on port ${port}!`)
});


// app.listen(3032, () => console.log('Server ready at port 3032'))
