var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;

try {
    mongoose.connect( process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));
}catch (error) {
    console.log("could not connect");
}
mongoose.set('useCreateIndex', true);

//reviews Schema
var ReviewsSchema = new Schema({
    reviewerid: { type: String, required: true},
    comment: { type: String, required: true},
    rating: { type: Number, required: true},
    movieid: {type: String, required: true, index: true}
});
module.exports = mongoose.model('Reviews', ReviewsSchema);