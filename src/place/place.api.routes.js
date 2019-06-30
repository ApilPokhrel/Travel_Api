const router = require('express').Router();
const PlaceModel = require("./place.schema");
const FileHandler = require('../../handler/FileHandler');
const Auth = require("../../middleware/Authenticate");
const RatingModel = require("./review.schema");

router.post("/", Auth.AuthorizeApi, FileHandler.upload, async (req, res, next)=>{
    let profiles = [];
    let place = new PlaceModel();
    if(req.files){
        for(var f of req.files){
          let profile = {type: f.mimetype, name: f.filename};
          profiles.push(profile);
        }
    }
    place.location.coordinates = [req.body.lng, req.body.lat];
    place.location.address = req.body.address;
    place.profiles = profiles;
    place.title = req.body.title;
    place.tag = req.body.tag;
    place.description = req.body.description;
    place = await place.save();
    res.json(place);
});


router.get("/", Auth.AuthorizeApi, (req, res, next)=>{
    let start = parseInt(req.query.start) || 0;
    let limit = parseInt(req.query.limit) || 10;
    let filter = req.query.filter || null;
    let tag = req.query.tag || null;
    let lat = req.query.lat || null;
    let lng = req.query.lng || null;
    let distance = parseInt(req.query.distance) || 10000;
    if(lat && lng && tag){
        const coordinates = [lng, lat].map(parseFloat);
        distance = parseInt(distance);
        let q  = {
            tag,
          location: {
            $near:{
              $geometry:{
                type: 'Point',
                coordinates
              },
              $maxDistance: distance
            }
          }
        }
        PlaceModel.find(q).then(d => res.json(d))
        .catch(e => next(e));
     }else{
         PlaceModel.getAll({start, limit, filter, tag, lat, lng, distance})
        .then(d =>{res.json(d.data)})
         .catch(e => next(e));
        }
});


router.delete("/:id", Auth.AuthorizeApi, (req, res, next)=>{
    var fs = require('fs');
    var filePath = process.env.FILE_PATH; 
    PlaceModel.findByIdAndRemove(req.params.id)
   .then(d=>{
    for(var f of d.profiles){
    fs.unlinkSync(filePath+"/"+ f.name);
    }
    res.json(d)
    })
   .catch(e=>next(e));
});


router.post("/:id/rating", Auth.AuthorizeApi, async (req, res, next)=>{
  
     let ratingModel = await RatingModel.findOneAndUpdate({user: req.user._id, place: req.params.id}, {
         user: req.user._id,
         place: req.params.id,
         text: req.body.text,
         rating: req.body.rating
     } , {upsert:true, new: true})
     res.json(ratingModel);
});

router.get("/:id/rating", Auth.AuthorizeApi, async (req, res, next)=>{
    let ratingModel = await RatingModel.findOne({user: req.user._id, place: req.params.id});
    res.json(ratingModel);
});

router.get("/:id/rating/total", Auth.AuthorizeApi, async (req, res, next)=>{
    let PlaceModel = await PlaceModel.getTopPlaceByReview();
    res.json(PlaceModel);
});


module.exports = router;