const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.POST || 2000;
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'userManager';

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
        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            res.render('allUsers', ({
                usersInfo: docs.map(user =>
                  ({
                    _id: user._id,
                    userId: user.newUser.userId,
                    name: user.newUser.name,
                    email: user.newUser.email,
                    age: user.newUser.age,

                  }))
            }));
        });
        client.close();
    });
});
let nameSorted = 0;
let idSorted = 0;
let emailSorted = 0;
let ageSorted = 0;
app.get('/sort/:id', (req,res) =>{

    MongoClient.connect(url, function(err, client) {
        const db = client.db(dbName);
        const collection = db.collection('users');

        assert.equal(null, err);
        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);

            let allUsers = docs.map(user =>
                ({
                    _id: user._id,
                    userId: user.newUser.userId,
                    name: user.newUser.name,
                    email: user.newUser.email,
                    age: user.newUser.age,

                }));

            if (req.params.id === 'name') {

                switch (nameSorted) {
                    case 0:
                        allUsers.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            else if (a.name > b.name) {
                                return 1
                            }
                            else {
                                return 0
                            }
                        });

                        nameSorted = 1;
                        break;
                    case 1:
                        allUsers.sort((a, b) => {
                            if (a.name > b.name) {
                                return -1;
                            }
                            else if (a.name < b.name) {
                                return 1
                            }
                            else {
                                return 0
                            }
                        });

                        nameSorted = 0;

                }
            }

            else if (req.params.id === 'userId') {

                switch (idSorted) {
                    case 0:
                        allUsers.sort((a, b) => {
                            if (a.userId < b.userId) {
                                return -1;
                            }
                            else if (a.userId > b.userId) {
                                return 1
                            }
                            else {
                                return 0
                            }
                        });

                        idSorted = 1;
                        break;
                    case 1:
                        allUsers.sort((a, b) => {
                            if (a.userId > b.userId) {
                                return -1;
                            }
                            else if (a.userId < b.userId) {
                                return 1
                            }
                            else {
                                return 0
                            }
                        });

                        idSorted = 0;

                }
            }

            else if (req.params.id === 'email') {

                switch (emailSorted) {
                    case 0:
                        allUsers.sort((a, b) => {
                            if (a.email < b.email) {
                                return -1;
                            }
                            else if (a.email > b.email) {
                                return 1
                            }
                            else {
                                return 0
                            }
                        });

                        emailSorted = 1;
                        break;
                    case 1:
                        allUsers.sort((a, b) => {
                            if (a.email > b.email) {
                                return -1;
                            }
                            else if (a.email < b.email) {
                                return 1
                            }
                            else {
                                return 0
                            }
                        });

                        emailSorted = 0;

                }
            }

            else if (req.params.id === 'age') {

                switch (ageSorted) {
                    case 0:
                        allUsers.sort((a, b) => {
                            if (a.age < b.age) {
                                return -1;
                            }
                            else if (a.age > b.age) {
                                return 1
                            }
                            else {
                                return 0
                            }
                        });

                        ageSorted = 1;
                        break;
                    case 1:
                        allUsers.sort((a, b) => {
                            if (a.age > b.age) {
                                return -1;
                            }
                            else if (a.age < b.age) {
                                return 1
                            }
                            else {
                                return 0
                            }
                        });

                        ageSorted = 0;

                }
            }

            res.render('allUsers', ({
                usersInfo: allUsers,
                sorted: nameSorted
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
    res.redirect('/')
});

app.get('/delete/:id', (req, res) =>{

    MongoClient.connect(url, function(err, client) {
        const db = client.db(dbName);
        const collection = db.collection('users');
        assert.equal(null, err);

        collection.deleteOne({"newUser.userId": req.params.id}, function(err, result) {
            assert.equal(err, null);
        });
        client.close();
        res.redirect('/')
    });

});

app.get('/edit/:id', (req, res) =>{


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
        collection.insertOne({newUser}, function(err, result) {
            assert.equal(err, null);
        });
        collection.find({"newUser.userId": req.params.id}).toArray(function(err, docs) {
            assert.equal(err, null);

            res.render('edit', ({
                data: docs.map(user =>
                    ({
                        _id: user._id,
                        userId: user.newUser.userId,
                        name: user.newUser.name,
                        email: user.newUser.email,
                        age: user.newUser.age,

                    }))
            }));
        });
        client.close();
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
        collection.insertOne({newUser}, function(err, result) {
            assert.equal(err, null);
        });
        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            res.render('allUsers', ({
                usersInfo: docs.map(user =>
                  ({
                    _id: user._id,
                    userId: user.newUser.userId,
                    name: user.newUser.name,
                    email: user.newUser.email,
                    age: user.newUser.age,

                  }))
            }));
        });
        client.close();
    });

});

app.post('/users', (req, res) =>{

    MongoClient.connect(url, function(err, client) {
        const db = client.db(dbName);
        const collection = db.collection('users');
        let query = {"newUser.userId": req.body.userID};
        let newValues = { $set: {newUser: {
                'userId' : req.body.userID,
                'name' : req.body.name,
                'email' : req.body.email,
                'age' : req.body.age,
            }}};

        assert.equal(null, err);

        collection.updateOne(query, newValues, function(err, res) {
            if (err) throw err;
        });
        collection.deleteMany({"newUser.userId": null}, function(err, result) {
            assert.equal(err, null);
        });
        client.close();
        res.redirect('/');
    });


});

app.post('/search', (req,res) =>{

    MongoClient.connect(url, function(err, client) {
        const db = client.db(dbName);
        const collection = db.collection('users');
        assert.equal(null, err);

        collection.find({'newUser.name':req.body.search}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log(req.body.search);
            console.log(docs);
            res.render('allUsers', ({
                usersInfo: docs.map(user =>
                    ({
                        _id: user._id,
                        userId: user.newUser.userId,
                        name: user.newUser.name,
                        email: user.newUser.email,
                        age: user.newUser.age,
                        req:req
                    }))
            }));
        });
        client.close();
    });

});

app.listen(port,() =>{
    console.log(`Listening on ports ${port}`);
});
