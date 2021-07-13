const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')

app.use(cors())
app.options('*', cors())

const api = process.env.API_URL

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('tiny'))

// ROUTES
const categoriesRoutes = require('./routes/categories')
const ordersRoutes = require('./routes/orders')
const productsRoutes = require('./routes/products')
const usersRoutes = require('./routes/users')

app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/orders`, ordersRoutes)
app.use(`${api}/products`, productsRoutes)
app.use(`${api}/users`, usersRoutes)

// DATABASE
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    dbName: 'eshop',
  })
  .then(() => {
    console.log('Database Connection Is Ready...')
  })
  .catch((err) => {
    console.log(err)
  })

app.listen(3000, () => {
  console.log('Server Is Running http://localhost:3000')
})
