// importing the dependencies
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { startDatabase } = require('./database/mongo')
const { insertAd, getAds, deleteAd, updateAd } = require('./database/ads')

// defining the Express app
const app = express()

// adding Helmet to enhance your API's security
app.use(helmet())

// using bodyParser to parse JSON bodies into JS objects
// app.use(bodyParser.json())
// bodyParser is deprecated in favor of express.json
app.use(express.json())

// enabling CORS for all requests
app.use(cors())

// adding morgan to log HTTP requests
// app.use(morgan('combined'))
// should do a check to see if in local dev, if so, use dev
app.use(morgan('dev'))

// defining an endpoint to return all ads
app.get('/', async (req, res) => {
  res.send(await getAds())
})

app.post('/', async (req, res) => {
  const newAd = req.body
  const id = await insertAd(newAd)
  res.send({ message: 'New ad inserted.', id })
})

// endpoint to delete an ad
app.delete('/:id', async (req, res) => {
  const deletedAd = await deleteAd(req.params.id)
  res.send({ message: 'Ad removed.', deletedAd })
})

// endpoint to update an ad
app.put('/:id', async (req, res) => {
  const updatedAd = req.body
  const update = await updateAd(req.params.id, updatedAd)
  res.send({ message: 'Ad updated.', update })
})

// start the in-memory MongoDB instance
startDatabase().then(async () => {
  await insertAd({ title: 'Hello, now from the in-memory database!' })

  // start the server
  app.listen(3001, async () => {
    console.log('listening on port 3001')
  })
})
