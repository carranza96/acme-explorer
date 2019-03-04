'use strict';

/*---------------ITEM----------------------*/
var mongoose = require('mongoose'),
  Item = mongoose.model('Items');

exports.list_all_items = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  Item.find(function(err, items) {
    if (err){
      res.status(500).send(err);
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
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        res.status(500).send(err);
      }
    }
    else{
      res.json(item);
    }
  });
};
// /items/search?categoryId="id"&q="searchString"&sortedBy="price|name"&reverse="false|true"&startFrom="valor"&pageSize="tam&deleted=true|false"
exports.search_items = function(req, res) {
  //In further version of the code we will:
  //1.- control the authorization in order to include deleted items in the results if the requester is an Administrator.
  var query = {};
    
  if(req.query.categoryId){
    query.category=req.query.categoryId;
  }
  if (req.query.q) {
    query.$text = {$search: req.query.q};
  }
  if(req.query.deleted){
    query.deleted = req.query.deleted;
  }

  var skip=0;
  if(req.query.startFrom){
    skip = parseInt(req.query.startFrom);
  }
  var limit=0;
  if(req.query.pageSize){
    limit=parseInt(req.query.pageSize);
  }

  var sort="";
  if(req.query.reverse=="true"){
    sort="-";
  }
  if(req.query.sortedBy){
    sort+=req.query.sortedBy;
  }

  console.log("Query: "+query+" Skip:" + skip+" Limit:" + limit+" Sort:" + sort);

  Item.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(function(err, item){
    console.log('Start searching items');
    if (err){
      res.send(err);
    }
    else{
      res.json(item);
    }
    console.log('End searching items');
  });
};


exports.read_an_item = function(req, res) {
    Item.findById(req.params.itemId, function(err, item) {
      if (err){
        res.status(500).send(err);
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
        if(err.name=='ValidationError') {
            res.status(422).send(err);
        }
        else{
          res.status(500).send(err);
        }
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
            res.status(500).send(err);
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
      res.status(500).send(err);
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
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        res.status(500).send(err);
      }
    }
    else{
      res.json(categ);
    }
  });
};


exports.read_a_category = function(req, res) {
  Category.findById(req.params.categId, function(err, categ) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(categ);
    }
  });
};

exports.update_a_category = function(req, res) {
  Category.findOneAndUpdate({_id: req.params.categId}, req.body, {new: true}, function(err, categ) {
    if (err){
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        res.status(500).send(err);
      }
    }
    else{
      res.json(categ);
  }
  });
};

exports.delete_a_category = function(req, res) {
  Category.deleteOne({_id: req.params.categId}, function(err, categ) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json({ message: 'Category successfully deleted' });
    }
  });
};