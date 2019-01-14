const express = require("express");

const { MongoClient } = require("mongodb"); //destructuring
const axios = require("axios");
const bodyParser = require('body-parser');
const url = 'mongodb://anthony:root01@ds155164.mlab.com:55164/heroku_3hr0r81r';
const dbName = 'heroku_3hr0r81r';
const port = process.env.PORT || 3000;


// Connect using the connection string
MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
    const app = express();

    if (err) {
        app.use((req, res) => res.status(500).send('An error occurred'));
    }

    const Api = axios.get("https://latelier.co/data/cats.json")

    Api.then(res => {
    	const db = client.db(dbName);
    	
    	db.collection("cats").createIndex({url: 1}, {unique: true});
    	db.collection("cats").insertMany(res.data.images.map(cat => ({
    		url: cat.url,
    		score:0
    	})))
    	
    }).catch(console.log);

	app.use((req, res, next) => {
		req.mongoInstance = client.db(dbName);
		next();
    });

    app.use(express.static("public"));
    app.use(bodyParser());

    //récupére tous les chats

    app.get('/cats', async (req, res) => {
    	try {
    		const cats =  await req.mongoInstance.collection("cats").find().limit(parseInt(req.query.nb)).sort( { score: -1 }).toArray();
    		return res.status(200).send(cats);
    	} catch (err) {
    		return res.status(404).send(err);
    	}
    });

    app.post('/increment', async (req, res) => {
    	try {
    		const cat =  await req.mongoInstance.collection("cats").findOneAndUpdate({ url: req.body.url }, { $inc: { score: 1 } });
    		return res.status(200).send(cat);
    	} catch (err) {
    		return res.status(503).send(err);
    	}
    });

    app.listen(port, () => console.log(`App running on port ${port}`));
});
