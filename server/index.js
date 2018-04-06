const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const massive = require("massive");
require("dotenv").config();

const app = express();

app.use(express.static(`${__dirname}/../build`))



app.use(bodyParser.json());
app.use(cors());


massive(process.env.CONNECTION_STRING)
    .then(dbInstance => {
        app.set("db", dbInstance);
        // console.log(dbInstance);
    })
    .catch(() => console.log("error"));

app.get("/api/poems", (req, res) => {

    const dbInstance = req.app.get("db");

    dbInstance.getAllPoems().then((results) => {
        res.status(200).send(results)
    }).catch((err) => {
        res.status(500).send(err)
    })

})

app.post("/api/noName", (req, res) => {
    const dbInstance = req.app.get("db");

    dbInstance.addAnonymousPoem(req.body.body, req.body.title).then(() => {
        dbInstance.getAllPoems().then((results) => {
            res.status(200).send(results)
        })

    }).catch(() => console.log("error"))
})

app.post("/api/add", (req, res) => {
    const dbInstance = req.app.get("db");

    dbInstance.addpoem(req.body.author, req.body.body, req.body.title).then(() => {

        dbInstance.getAllPoems().then((results) => {
            res.status(200).send(results)
        })
    }).catch(() => console.log("error"))
})





let port = 1738
const path = require('path');

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
})

app.listen(port, () => console.log(`listening on port ${port}`));
