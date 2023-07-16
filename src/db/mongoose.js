const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGO_URL, {})


// const person = new User({
//     name: 'Andrew',
//     age: '27'
// })

// person.save().then((person) => {
//     console.log(person)
// }).catch((error) => {
//     console.log(error)
// })

// const task = new Task({
//     description: "eat"
// })

// task.save().then(() => {
//     console.log(task)
// }).catch((error) => {
//     console.log(error)
// })