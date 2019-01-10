const express = require("express");

const { MongoClient } = require("mongodb"); //destructuring
const axios = require("axios");
const bodyParser = require('body-parser');
const url = 'mongodb://localhost:27017';
const dbName = 'catmatch';


// Connect using the connection string
MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
    const app = express();

    if (err) {
        app.use((req, res) => {
            res.status(500).send('An error occurred');
        });
    }

    const Api = axios.get("https://latelier.co/data/cats.json")

    Api.then(res => {
    	const db = client.db(dbName);
    	
    	db.collection("cats").createIndex({url: 1}, {unique: true});
    	db.collection("cats").insertMany(res.data.images.map(cat => ({
    		url: cat.url,
    		score:0
    	})))
    	
    }).catch(error => {
    	console.log(error);
    });

	app.use((req, res, next) => {
		req.mongoInstance = client.db(dbName);
		next();
    });

    app.use(express.static("public"));
    app.use(bodyParser());


});