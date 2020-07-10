const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log('Connected to database!');
})
    .catch(() => {
        console.log('Connection failed!');
    });

module.exports = mongoose;
