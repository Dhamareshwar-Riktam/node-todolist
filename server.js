const express = require('express');
const app = express();
const dotenv = require('dotenv');
const _ = require('lodash');


// Configuration
dotenv.config();
require('./config/db.js');


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


// Constants
const PORT = process.env.PORT || 3000;
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


// import models
const Item = require('./models/Item');
const List = require('./models/List');


const item1 = new Item({
    name: "This is Item 1"
});

const item2 = new Item({
    name: "Use + button to add new item"
});

const item3 = new Item({
    name: "<-- Use this checkbox to delete item"
});

const defaultItems = [item1, item2, item3];



// Routes
app.get('/', (req, res) => {

    let today = new Date();
    let currentDay = today.getDay();

    Item.find()
        .then(items => {
            if (items.length !== 0) {
                return res.render('weekday', { day: weekDays[currentDay], items: items });
            } else {
                Item.insertMany(defaultItems)
                    .then(() => {
                        return res.render('weekday', { day: weekDays[currentDay], items: defaultItems });
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));

});

app.post("/", (req, res) => {
    let today = new Date();
    let currentDay = today.getDay();

    const listName = req.body.list;

    const item = new Item({
        name: req.body.newItem
    });

    if (listName === weekDays[currentDay]) {
        item.save()
            .then(item => res.redirect('/'))
            .catch(err => console.log(err));

    } else {
        List.findOne({ name: listName })
            .then(list => {
                if (!list) {
                    const list = new List({
                        name: listName,
                        items: [item]
                    });
                    list.save()
                        .then(list => res.redirect('/' + listName))
                        .catch(err => console.log(err));
                } else {
                    list.items.push(item);
                    list.save()
                        .then(list => res.redirect('/' + listName))
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    }

});

app.post('/delete', (req, res) => {
    let today = new Date();
    let currentDay = today.getDay();
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === weekDays[currentDay]) {
        Item.findByIdAndRemove(checkedItemId)
            .then(item => res.redirect('/'))
            .catch(err => console.log(err));
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } })
            .then(list => res.redirect('/' + listName))
            .catch(err => console.log(err));
    }
})

app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName })
        .then(foundList => {
            if (foundList) {
                // Show Existsing List
                res.render('weekday', { day: foundList.name, items: foundList.items })
            } else {
                // Create New List
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect('/' + customListName);
            }
        })
        .catch(err => console.log(err));


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