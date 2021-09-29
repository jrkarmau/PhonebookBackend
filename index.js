require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
const PORT = process.env.PORT

app.use(express.static('build'))
app.use(express.json())
app.use(cors())



morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms :res[content-length] :body'))

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name) {
    return res.status(400).json({
      error: 'name is empthy'
    })
  }
  if (!body.number) {
    return res.status(400).json({
      error: 'number is empthy'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.get('/api/persons/', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person.countDocuments({}).then(count => {
    res.send(
      `<p> Phonebook has info for ${count} people </p>
       <p> ${new Date()} </p>`)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`)
})
