const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const log = console.log;
const publicPath = path.join(__dirname + "/public");

let logfile = [];

app.use(express.static(publicPath));


app.get("/history", (req, res) => { // displays the last 20 logs
    res.sendFile(publicPath + "/history.html");
});

app.get("/logFile", (req, res) => { // act as a api for fetching logfile data in html file
    res.send(logfile);
});


app.get("/favicon.ico", (req, res) => { // for handling eval() function favicon not found error
    res.sendFile(publicPath + "/index.html");
});

app.get("*", (req, res) => { // parsing the url request
    let data = req.url;
    let n = data.length;

    data = req.url.substring(1, n).split("/");
    n = data.length;

    const operators = new Map([
        ["add", "+"],
        ["plus", "+"],
        ["substract", "-"],
        ["minus", "-"],
        ["multiply", "*"],
        ["into", "*"],
        ["divide", "/"],
        ["by", "/"],
    ]);

    let error404 = false;

    for (let i = 1; i < n; i += 2) {
        if (operators.has(data[i]) == true) data[i] = operators.get(data[i]);
        else {
            error404 = true;
            break;
        }
    }

    if (error404) res.sendFile(publicPath + "/error.html");
    else {
        let question = "", answer = 0;
        for (let i = 0; i < n; i++) {
            question += data[i];
        }

        const result = {
            "question": question,
            "answer": eval(question).toFixed(2),
        }

        logfile = [result, ...logfile];
        if (logfile.length > 20) logfile.pop();

        res.json(logfile);
    }

});

app.listen(3000, () => { // starts the server on the specified port
    log("Server running on port: 3000");
});