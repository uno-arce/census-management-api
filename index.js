const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes.js')
const recordRoutes = require('./routes/recordRoutes.js')

dotenv.config()
const app = express()

// Server Setup and Cors Configuration
app.use(cors())

app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Middleware
app.use('/users', userRoutes)
app.use('/records', recordRoutes)

const PORT = process.env.PORT || 4000
if(require.main === module) {
	app.listen(PORT, () => console.log(`API is now online on port ${PORT}`))
}