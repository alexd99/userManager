const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const port = process.env.POST || 2000;

let app =  express();
let users = [];
let id = 0;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./views'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/', (req, res) =>{
    res.render('form');
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

    let newUser = {
        id: id,
        userId: req.body.userID,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    };
    id++;

    users.push(newUser);
    res.render('allUsers', ({
        usersInfo: users
    }));
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

// process.on('SIGTERM', ()=>{
//     fs.writeFile('./userInformation.json', users, (err)=>{
//         if (err) throw err ;
//     });
//     process.exit(0);
// });
//
// // when i press ctrl c
// process.on('SIGINT', ()=>{
//     fs.writeFile('./userInformation.json', 'hello', (err)=>{
//         if (err) throw err ;
//     });
//     process.exit(0);
// });


app.listen(port,() =>{
    console.log(`Listening on port ${port}`);
});
