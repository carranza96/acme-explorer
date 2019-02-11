'use strict';

/*---------------ITEM----------------------*/
var mongoose = require('mongoose'),
  Item = mongoose.model('Items');

exports.list_all_items = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  Item.find(function(err, items) {
    if (err){
      res.send(err);
    }
    else{
      res.json(items);
    }
  });
};


exports.create_an_item = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  var new_item = new Item(req.body);
  new_item.save(function(err, item) {
    if (err){
      res.send(err);
    }
    else{
      res.json(item);
    }
  });
};

exports.search_items = function(req, res) {
  //Check if category param exists (category: req.query.category)
  //Check if keyword param exists (keyword: req.query.keyword)
  //Search depending on params but only if deleted = false
  console.log('Searching an item depending on params');
  res.send('Item returned from the item search');
};


exports.read_an_item = function(req, res) {
    Item.findById(req.params.itemId, function(err, item) {
      if (err){
        res.send(err);
      }
      else{
        res.json(item);
      }
    });
};


exports.update_an_item = function(req, res) {
  //Check that the user is administrator if it is updating more things than comments and if not: res.status(403); "an access token is valid, but requires more privileges"
    Item.findOneAndUpdate({_id: req.params.itemId}, req.body, {new: true}, function(err, item) {
      if (err){
        res.send(err);
      }
      else{
        res.json(item);
      }
    });
};

exports.delete_an_item = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
    Item.deleteOne({_id: req.params.itemId}, function(err, item) {
        if (err){
            res.send(err);
        }
        else{
            res.json({ message: 'Item successfully deleted' });
        }
    });
};


/*---------------CATEGORY----------------------*/
var mongoose = require('mongoose'),
  Category = mongoose.model('Categories');

exports.list_all_categories = function(req, res) {
  Category.find({}, function(err, categs) {
    if (err){
      res.send(err);
    }
    else{
      res.json(categs);
    }
  });
};

exports.create_a_category = function(req, res) {
  var new_categ = new Category(req.body);
  new_categ.save(function(err, categ) {
    if (err){
      res.send(err);
    }
    else{
      res.json(categ);
    }
  });
};


exports.read_a_category = function(req, res) {
  Category.findById(req.params.categId, function(err, categ) {
    if (err){
      res.send(err);
    }
    else{
      res.json(categ);
    }
  });
};

exports.update_a_category = function(req, res) {
  Category.findOneAndUpdate({_id: req.params.categId}, req.body, {new: true}, function(err, categ) {
    if (err){
      res.send(err);
    }
    else{
      res.json(categ);
  }
  });
};

exports.delete_a_category = function(req, res) {
  Category.deleteOne({_id: req.params.categId}, function(err, categ) {
    if (err){
      res.send(err);
    }
    else{
      res.json({ message: 'Category successfully deleted' });
    }
  });
};