const express = require('express');
const app = express();
const dotenv = require('dotenv');


// Configuration
dotenv.config();


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


// Constants
const PORT = process.env.PORT || 3000;

let items = ["Buy milk", "Buy bread", "Buy cheese"];
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let workItems = [];

// Routes
app.get('/', (req, res) => {
    let today = new Date();
    let currentDay = today.getDay();
    res.render('weekday', { day: weekDays[currentDay], items });
});

app.post("/", (req, res) => {
    let today = new Date();
    let currentDay = today.getDay();
    if (req.body.button === weekDays[currentDay]) {
        console.log(req.body);
        var item = req.body.newItem;
        items.push(item);
        res.redirect("/");
    }
});

app.get('/work', (req, res) => {
    res.render("weekday", { day: "Work List", items: workItems })
});

app.post('/work', (req, res) => {
    if (req.body.button === "Work") {
        let item = req.body.newItem;
        workItems.push(item);
        res.redirect('/work');
    }
});


app.get('/about', (req, res) => {
    res.render("about");
})


// Server
app.listen(PORT, () => console.log(`Server running @${PORT}`));