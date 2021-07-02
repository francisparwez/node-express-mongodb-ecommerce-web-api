const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')

require('dotenv/config')
const api = process.env.API_URL

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('tiny'))

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: [true, 'Count In Stock Is Required'],
  },
})

const Product = mongoose.model('Product', productSchema)

app.get(`${api}/products`, async (req, res) => {
  const productList = await Product.find()
  if (!productList) {
    res.status(500).json({ success: false })
  }
  res.send(productList)
})

app.post(`${api}/product`, (req, res) => {
  console.log(`${api}/product`)
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  })
  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct)
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      })
    })
})

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
