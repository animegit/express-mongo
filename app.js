const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

console.log("Starting server...");

MongoClient.connect("mongodb://127.0.0.1:27017/animesh", function(err, client) {
    if (err) {
        console.log("Error connecting to MongoDB", err);
        return;
    }
    
    console.log("MongoDB connected");
    const db = client.db('animesh');


    app.use(express.static('public'));

   
    app.get('/insert', function(req, res) {
        console.log("Insert route hit");
        const { id, name, age } = req.query;
        console.log(`Insert: id=${id}, name=${name}, age=${age}`);
        db.collection('dept').insertOne({ id, name, age }, function(err, result) {
            if (err) {
                console.log("Error inserting", err);
                res.status(500).send("Error inserting");
            } else {
                res.end(JSON.stringify(req.query));
            }
        });
    });

    // Delete route
    app.get('/delete', function(req, res) {
        console.log("Delete route hit");
        const { id } = req.query;
        console.log(`Delete: id=${id}`);
        db.collection('dept').deleteOne({ id }, function(err, result) {
            if (err) {
                console.log("Error deleting", err);
                res.status(500).send("Error deleting");
            } else {
                res.end(`Document with id ${id} deleted`);
            }
        });
    });

    // Get route
    app.get('/get', function(req, res) {
        console.log("Get route hit");
        const { id } = req.query;
        console.log(`Get: id=${id}`);
        db.collection('dept').find({ id }).sort().toArray(function(err, data) {
            if (err) {
                console.log("Error finding", err);
                res.status(500).send("Error finding");
            } else {
                res.end(JSON.stringify(data));
            }
        });
    });

    // Update route
    app.get('/update', function(req, res) {
        console.log("Update route hit");
        const { id, name, age } = req.query;
        const updateFields = {};
        if (name) updateFields.name = name;
        if (age) updateFields.age = age;

        console.log(`Update: id=${id}, updateFields=${JSON.stringify(updateFields)}`);
        db.collection('dept').updateOne({ id }, { $set: updateFields }, function(err, result) {
            if (err) {
                console.log("Error updating", err);
                res.status(500).send("Error updating");
            } else {
                res.end(`Document with Id ${id} updated`);
            }
        });
    });

    // Start the server on port 5000
    app.listen(5000, function() {
        console.log("Server is listening on port 5000");
    });
});

console.log("Server.js execution complete");
