const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/user_database', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('Mongoose successfully connected')
    }).catch(() => {
        console.log('Mongoose connection failed')
    });
const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const contentModel = mongoose.model('users', new mongoose.Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique: true, required: true, lowercase: true}
}))

const port = process.env.PORT || 5000;
const app = express();
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

//functions

const removeUser = ((id) => {
    contentModel.findByIdAndDelete(id, (err, object) => {
        if (err) {
            console.log('Error while removing a person')
            return {
                err: 'error removing a person'
            }
        }
    })
})

const addUser = (({name, surname, email}) => {
    new contentModel({name, surname, email}).save().then(() =>{
        return 'Successfully added user to the database'
    }
    ).catch(() => {
        return 'Failure to add user in database'
    });
})

let array = []

function values() { 
    db.collection('users').find(async (err, object) => {
    if (err) {
        console.log(err)
        return err;
    }

    let pageNames = []

    await object.forEach((doc) => {
        const name = doc.name;
        const surname = doc.surname
        const email = doc.email
        const _id = doc._id
        pageNames.push({_id, name, surname, email})
    })

    array = pageNames
   return pageNames
})
}

addUser({name: 'Nemanja', surname: 'Turi', email:'exp@example.com'})

//routes

app.get('/', async (req, res) => {
    await values();
    res.json({data: array});
})

app.get('/add', (req, res) => {
    const { name, surname, email} = req.query
    addUser({name, surname, email})
    res.send({data: addUser({name, surname, email})})
})

app.get('/remove', (req, res) => {
    const {id} = req.query
    console.log(id)
    removeUser(id)
    res.send({data: removeUser(id)})
})

app.listen(port, () => {
    console.log('listening on ' + port)
})