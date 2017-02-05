const express = require('express')
const bodyParser = require('body-parser')
const mongoClient = require('mongodb').MongoClient
const path = require('path')
require('dotenv').config()
const app = express()

mongoClient.connect(process.env.MONGO_URI, (err, database) => {
    if (err) return console.log(err)
    db = database
    app.listen(3000, () => {
        console.log('Listening on 3000')
    })
})

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
    db.collection('posts').find().sort({$natural:1}).limit(50).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('index.ejs', {posts: result})
        // console.log(result)
    })
})

app.get('/rules', function (req, res) {
    res.render('rules.ejs')
})

app.get('/image-hosting', function (req, res) {
    res.render('image-hosting.ejs')
})

app.post('/posts', (req, res) => {
    db.collection('posts').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})

app.listen(8000, function () {
    console.log('Listening at port 8000');
})

