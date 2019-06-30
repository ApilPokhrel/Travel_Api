const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const placeSchema = mongoose.Schema({
  title: String,
  description: String,
  profiles:[],
  tag: String,
  contact: String,
  features:[String],
  location: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: [Number],
    address: {
      type: String
    }
  }
},{
  timestamps: true
});

placeSchema.index({ location: '2dsphere' });

placeSchema.virtual('reviews',{
  ref: 'Review',
  localField: '_id',
  foreignField: 'place'
});

placeSchema.statics.getAll = async function({ start, limit, filter, tag, lat, lng, distance}){
    let page = parseInt(start) / parseInt(limit) + 1;
    let query = {};
    let sort = {title: 1};
    if (filter){
       if(filter == "latest"){
         sort = {createdAt : -1}
       }else if(filter == "rated"){
         sort = { average: -1 }
       }else if(filter == "related"){
         sort = {"location.coordinates.1": -1}
       }
    }
    
    return new Promise((resolve, reject) => {
      this.aggregate([
        {
          $facet: {
            data: [
            
                {
                  $lookup:{
                  from: 'reviews',
                  localField: '_id',
                  foreignField: 'place',
                  as: 'reviews'
                }
               },
               
              {
                $project: {
                  title: 1,
                  location: 1,
                  tag: 1,
                  description: 1,
                  features: 1,
                  profiles: 1,
                  reviews: 1,
                  average: { $avg: '$reviews.rating' }
                }
              },
              {
                $match: query
              },
              {
                $sort: sort
              },
              {
                $skip: start
              },
              {
                $limit: limit
              }
            ],
            summary: [
              {
                $group: {
                  _id: null,
                  count: {
                    $sum: 1
                  }
                }
              }
            ]
          }
        }
      ])
        .then(d => {
          if (d[0].summary.length > 0)
            resolve({
              total: d[0].summary[0].count,
              limit,
              start,
              page,
              data: d[0].data
            });
          else
            resolve({
              total: 0,
              limit,
              start,
              page,
              data: []
            });
        })
        .catch(e => reject(e));
    });
  
  
}


placeSchema.statics.getTopPlaceByReview = function(){
   return this.aggregate([
     {
       $lookup:{
       from: 'reviews',
       localField: '_id',
       foreignField: 'place',
       as: 'reviews'
     }
    },
    {
      $match :{'reviews.1' : { $exists: true}}
    },
    {
      $project:{
        location: 1,
        description: 1,
        title: 1,
        tag: 1,
        reviews: 1,
        profiles: 1,
        count: { $sum: '$reviews' } ,
        average: { $avg: '$reviews.rating' }
      }
    },
    {
       $sort : { average: -1 }
    },
    { $limit: 10}
   ])
}


module.exports = mongoose.model("Place", placeSchema);