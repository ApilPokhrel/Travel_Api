const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const reviewSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: "Must have user!"
    },
    place:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
        required: "Must supply place!"
    },
    text:{
        type: String,
    },
    rating: {
       type: Number,
       min: 1,
       max: 5
    }
},{
    timestamps: true
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}

});

module.exports = mongoose.model("Review", reviewSchema);