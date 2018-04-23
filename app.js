const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.POST || 2000;

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'userManager';

let users = [];

let app =  express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./views'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/', (req,res) =>{
    MongoClient.connect(url, function(err, client) {
        const db = client.db(dbName);
        const collection = db.collection('users');

        assert.equal(null, err);
        console.log("Connected successfully to server");

        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            console.log(docs);
            res.render('allUsers', ({
                usersInfo: docs
            }));
        });
        client.close();
    });
});

app.get('/addUser', (req, res) => {
    let userId = "";
    let possibleIDs = "ABCDEFGHIJKLMNOPQRSTUVWXY0123456789";

    for (let i = 0; i < 10; i++){
        userId += possibleIDs.charAt(Math.floor(Math.random() * possibleIDs.length));
    }
    res.render('form',  {
        uid: userId
    });
});

app.get('/cancelEdit', (req, res) =>{
    res.render('allUsers', {
        usersInfo: users
    });
});

 app.get('/delete/:id', (req, res) =>{
    for (let i = 0; i < users.length; i++){
        if (+req.params.id === users[i].id){
            users.splice(i, 1);
        }
    }
    res.render('allUsers',  {
        usersInfo: users
    });
});

app.get('/edit/:id', (req, res) =>{

    let user;

    for(let i = 0; i < users.length; i++){
        if (+req.params.id === users[i].id){
            user = users[i];
        }
    }
    res.render('edit', {
        info: user
    });
});

app.post('/viewUsers', (req,res) =>{

    MongoClient.connect(url, function(err, client) {
        const db = client.db(dbName);
        const collection = db.collection('users');
        let newUser = {
            userId: req.body.userID,
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        };

        assert.equal(null, err);
        console.log("Connected successfully to server");

        collection.insertOne({newUser}, function(err, result) {
            assert.equal(err, null);
            console.log("Inserted document into the collection");
        });
        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            console.log(docs);
            res.render('allUsers', ({
                usersInfo: docs
            }));
        });
        client.close();
    });

});

app.post('/users', (req, res) =>{
    for(let i = 0; i < users.length; i++){
        if(+req.body.id === users[i].id){
            users[i] = {
                id: users[i].id,
                userId: req.body.userID,
                name: req.body.name,
                email: req.body.email,
                age: req.body.age
            };
        }
    }
    res.render('allUsers', {
        usersInfo: users
    });
});

app.listen(port,() =>{
    console.log(`Listening on port ${port}`);
});