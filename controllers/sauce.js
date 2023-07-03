// in controllers/sauce.js

const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  req.body.sauce = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    mainPepper: req.body.sauce.mainPepper,
    imageUrl: url + '/images/' + req.file.filename,
    heat: req.body.sauce.heat,
    likes:0,
    dislikes:0,
    usersLiked:[],
    usersDisliked:[],
    userId: req.body.sauce.userId
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {

      console.log("test")
      res.status(400).json({
        error: 'error !'
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id:req.params._id });
  // console.log(req.body);
  const url = req.protocol + '://' + req.get('host');
  if (req.file) {
    
    req.body.sauce = JSON.parse(req.body.sauce);
    // console.log('userId',req.body.sauce)
    sauce = {
      _id: req.params.id,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      mainPepper: req.body.sauce.mainPepper,
      imageUrl: url + '/images/' + req.file.filename,
      heat: req.body.sauce.heat,
      likes:0,
      dislikes:0,
      usersLiked:[],
      usersDisliked:[],
      userId: req.body.sauce.userId
    };
  } else {
    // console.log('userId',req.body.sauce)
    sauce = {
    _id: req.params.id,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    heat: req.body.heat,
    userId: req.body.userId
    };
  }
  console.log(sauce);
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'Sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}).then(
    (sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        Sauce.deleteOne({_id: req.params.id}).then(
          () => {
            res.status(200).json({
              message: 'Deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      });
    }
  );
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

/* 
Create the function to manage 
the choices "like" and "dislike" from the user
and to update the total numbers (of likes & dislikes) 
for each sauce in the database
 */

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id:req.params.id })
  .then((sauce) => {
    const likeStatus = req.body.like;
    const userIdentity = req.body.userId;
    console.log(sauce);
    const update = {
      likes: sauce.likes,
      dislikes: sauce.dislikes,
      usersLiked: sauce.usersLiked,
      usersDisliked: sauce.usersDisliked
    }
    // We test the value of "likes" = 1, 0 or -1
    if (likeStatus === 1) {
      // If like = 1, the user likes the sauce 
      // so we add +1 to the total number "likes".
      update.likes +=1;
      update.usersLiked.push(userIdentity) // & updating the array "usersLiked"
    } else if (likeStatus === -1) {
      // If like = -1, the user dislikes the sauce 
      //so we add +1 to the total number "dislikes".
      update.dislikes +=1;
      update.usersDisliked.push(userIdentity) // & updating the array "usersDisliked"
    } else if (likeStatus === 0) {
      // If like = 0, the user is canceling their like or dislike
      // So we reset the number of likes or dislikes from this userId.

      if (update.usersLiked.includes(userIdentity)) {
        update.usersLiked.splice(update.usersLiked.indexOf(userIdentity));
      }
         
      if (update.usersDisliked.includes(userIdentity)){
        update.usersDisliked.splice(update.usersDisliked.indexOf(userIdentity));
      }
    }

    console.log(sauce);
    Sauce.updateOne({_id: req.params.id}, update).then(
      () => {
        res.status(201).json({
          message: 'LikeStatus of the Sauce has been updated successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  })
};