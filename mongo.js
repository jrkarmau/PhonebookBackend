const mongoose = require('mongoose')

/*global process*/
if (process.argv.length < 3) {
  console.log('give password')
  process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]


const url = `mongodb+srv://phonebook:${password}@phonebookdb.wug6y.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (newName) {
  const person = new Person({
    name: newName,
    number: newNumber
  })

  person.save().then(() => {
    console.log(`added ${newName} number ${newNumber} to phonebook`)
    mongoose.connection.close()
  })

} else {
  console.log('showing persons..')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}






