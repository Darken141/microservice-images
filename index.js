require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const app = express()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true , useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.on('open', () => console.log("Connected to Databse"))

const PORT  = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
    res.send({
        message: "Image service"
    })
})

const imageRouter = require('./routes/image.routes')

app.use("/images", imageRouter)

app.get('*', (req, res) => {
    res.send({message: "API route not found"})
})


app.listen(PORT, () => {
    console.log(`Image service is up and running on port: ${PORT}`)
})