const mongoose = require('mongoose');

const URL = process.env.MONGODB_URI;

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`Connected to MongoDB Atlas Successfully`))
    .catch(err => console.log(`Database Connection Failed:: ${err}`));