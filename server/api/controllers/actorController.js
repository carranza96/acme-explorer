'use strict';
/*---------------ACTOR----------------------*/
var mongoose = require('mongoose'),
  Actor = mongoose.model('Actor');
Application = mongoose.model('Application');
Trip = mongoose.model('Trip');
var admin = require('firebase-admin');
var authController = require('./authController');

exports.list_all_actors = function (req, res) {
  //Check if the role param exist
  var match = {};
  if (req.query.role) {
    var roleName = req.query.role;
    match = { role: roleName };
  }
  Actor.find(match, function (err, actors) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(actors);
    }
  });
};

exports.create_an_actor = function (req, res) {
  var new_actor = new Actor(req.body);
  if (new_actor.role.includes('ADMINISTRATOR') || new_actor.role.includes('MANAGER')) {
    res.status(422).send('You cannot create a new administrator/manager');
  }
  else {
    new_actor.save(function (err, actor) {
      if (err) {
        if (err.name == 'ValidationError') {
          res.status(422).send(err);
        }
        else {
          res.status(500).send(err);
        }
      }
      else {
        res.json(actor);
      }
    });
  }
};

exports.create_a_manager = function (req, res) {
  var new_actor = new Actor(req.body);
  if (new_actor.role.includes('ADMINISTRATOR')) {
    res.status(422).send('You cannot create a new administrator');
  }
  if (!new_actor.role.includes('MANAGER')) {
    res.status(422).send('Actor must be a manager');
  }
  else {
    new_actor.save(function (err, actor) {
      if (err) {
        if (err.name == 'ValidationError') {
          res.status(422).send(err);
        }
        else {
          res.status(500).send(err);
        }
      }
      else {
        res.json(actor);
      }
    });
  }
};

exports.create_an_admin = function (req, res) {
  var new_actor = new Actor(req.body);
  if (!new_actor.role.includes('ADMINISTRATOR')) {
    res.status(422).send('Actor must be an administrator');
  }
  else {
    new_actor.save(function (err, actor) {
      if (err) {
        if (err.name == 'ValidationError') {
          res.status(422).send(err);
        }
        else {
          res.status(500).send(err);
        }
      }
      else {
        res.json(actor);
      }
    });
  }

};


exports.login_an_actor = async function (req, res) {
  console.log('starting login an actor');
  var emailParam = req.query.email;
  var password = req.query.password;
  Actor.findOne({ email: emailParam }, function (err, actor) {
    if (err) { res.send(err); }

    // No actor found with that email as username
    else if (!actor) {
      res.status(401); //an access token isn’t provided, or is invalid
      res.json({ message: 'forbidden', error: err });
    }

    else if ((actor.banned)) {
      res.status(403); //an access token is valid, but requires more privileges
      res.json({ message: 'banned actor', error: err });
    }
    else {
      // Make sure the password is correct
      //console.log('En actor Controller pass: '+password);
      actor.verifyPassword(password, async function (err, isMatch) {
        if (err) {
          res.send(err);
        }

        // Password did not match
        else if (!isMatch) {
          //res.send(err);
          res.status(401); //an access token isn’t provided, or is invalid
          res.json({ message: 'forbidden', error: err });
        }

        else {
          try {
            var customToken = await admin.auth().createCustomToken(actor.email);
          } catch (error) {
            console.log("Error creating custom token:", error);
          }
          actor.customToken = customToken;
          console.log('Login Success... sending JSON with custom token');
          res.json(actor);
        }
      });
    }
  });
};


exports.read_an_actor = function (req, res) {
  Actor.findById(req.params.actorId, function (err, actor) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(actor);
    }
  });
};

exports.read_an_actor_v2 = function (req, res) {
  // Managers,Explorers and Sponsors can read theirselves, administrators can read any actor
  Actor.findById(req.params.actorId, async function (err, actor) {
    if (err) {
      res.send(err);
    }
    else if (!actor) {
      return res.status(404).send(`Actor with id ${req.params.actorId} does not exist in database`);
    }
    else {
      if (actor.role.includes('ADMINISTRATOR')) {
        res.json(actor);
      }
      else if (actor.role.includes('MANAGER') || actor.role.includes('EXPLORER') || actor.role.includes('SPONSOR')) {
        var idToken = req.headers['idtoken'];
        var authenticatedUserId = await authController.getUserId(idToken);
        if (authenticatedUserId == req.params.actorId) {
          res.json(actor)
        }
        else {
          res.status(403); //Auth error
          res.send('The Actor is trying to read an Actor that is not himself!');
        }
      }
      else {
        res.status(405); //Not allowed
        res.send('The Actor has unidentified roles');
      }
    }
  });
};

exports.update_an_actor = function (req, res) {
  Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true, runValidators: true }, function (err, actor) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      }
      else {
        res.status(500).send(err);
      }
    }
    else {
      res.json(actor);
    }
  });
};


exports.update_an_actor_v2 = function (req, res) {
  //Managers,Explorers and Sponsors can update theirselves, administrators can update any actor
  Actor.findById(req.params.actorId, async function (err, actor) {
    if (err) {
      res.send(err);
    }
    else if (!actor) {
      return res.status(404).send(`Actor with id ${req.params.actorId} does not exist in database`);
    }
    else {
      console.log('actor: ' + actor);
      var idToken = req.headers['idtoken'];//WE NEED the FireBase custom token in the req.header['idToken']... it is created by FireBase!!
      if (actor.role.includes('MANAGER') || actor.role.includes('EXPLORER') || actor.role.includes('SPONSOR')) {
        var authenticatedUserId = await authController.getUserId(idToken);
        if (authenticatedUserId == req.params.actorId) {
          Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true, runValidators: true }, function (err, actor) {
            if (err) {
              res.send(err);
            }
            else {
              res.json(actor);
            }
          });
        } else {
          res.status(403); //Auth error
          res.send('The Actor is trying to update an Actor that is not himself!');
        }
      } else if (actor.role.includes('ADMINISTRATOR')) {
        Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true, runValidators: true }, function (err, actor) {
          if (err) {
            res.send(err);
          }
          else {
            res.json(actor);
          }
        });
      } else {
        res.status(405); //Not allowed
        res.send('The Actor has unidentified roles');
      }
    }
  });

};


exports.ban_an_actor = function (req, res) {
  //Check that the user is an Administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  console.log("banning an actor with id: " + req.params.actorId)
  Actor.findOneAndUpdate({ _id: req.params.actorId }, { $set: { "banned": "true" } }, { new: true, runValidators: true }, function (err, actor) {
    if (err) {
      res.send(err);
    }
    else if (!actor) {
      res.status(404).send(`Actor with id ${req.params.actorId} does not exist in database`);
    }
    else {
      res.json(actor);
    }
  });
};


exports.unban_an_actor = function (req, res) {
  //Check that the user is an Administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  console.log("banning an actor with id: " + req.params.actorId)
  Actor.findOneAndUpdate({ _id: req.params.actorId }, { $set: { "banned": "false" } }, { new: true, runValidators: true }, function (err, actor) {
    if (err) {
      res.send(err);
    }
    else if (!actor) {
      res.status(404).send(`Actor with id ${req.params.actorId} does not exist in database`);
    }
    else {
      res.json(actor);
    }
  });
};

exports.delete_an_actor = function (req, res) {
  Actor.deleteOne({ _id: req.params.actorId }, function (err, actor) {
    if (err) {
      res.send(err);
    }
    else if (!actor) {
      res.status(404).send(`Actor with id ${req.params.actorId} does not exist in database`);
    }
    else {
      res.json({ message: 'Actor successfully deleted' });
    }
  });
};

exports.delete_all_actors = function (req, res) {
  Actor.deleteMany({}, function (err, actor) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'All actors successfully deleted' });
    }
  });
};

/** 
 * Compute a cube of stats about a given explorer.
 * We expect an explorer and a period p.
 * Period p can take: any value in M01-M36, that's any of
 * the last previous MXX months. Any value in Y01-Y03,
 * to denote 1 to 3 previous years.
*/

exports.compute_cube = function (req, res) {

  var actor_id = req.query.explorerId;
  var extracted_period = extract_period(req.query.period);
  var money = req.query.money;
  var operator = req.query.operator;

  console.log(new Date(), "Computing cube for explorer:")
  console.log(new Date(), actor_id);
  console.log(new Date(), extracted_period);
  console.log(new Date(), money);
  console.log(new Date(), operator);

  if (!extracted_period.period) {
    res.status(402);
    res.send("The period query param must be provided or is not in the correct format (i.e. Y01-Y03 or M01-M36).")
  } else if (actor_id !== undefined) {

    // both parameters are provided, check this actor is an explorer:
    Actor.findById(actor_id, function (err, actor) {
      if (err) {
        res.send(err);
      }
      else {

        // check
        if (!actor.role.includes("EXPLORER")) {
          res.status(402);
          res.send("The actor provided is not an explorer");
        }

        // it's an explorer, compute cube:
        var explorer_id = actor._id;
        var period_amount = parseInt(extracted_period.amount);

        if (extracted_period.period === 'Y') {
          // We compute it yearly for the last X amount of years
          var past_date = new Date();
          past_date.setFullYear(past_date.getFullYear() - period_amount);

          // Find applications paid by this explorer in the period
          calculate_money_spent(res, explorer_id, past_date);

        } else {
          // We compute it monthly for the last X amount of months
          var past_date = new Date();

          let years = Math.floor(period_amount / 12);
          let months = period_amount - 12 * years;

          // Go back X years
          past_date.setFullYear(past_date.getFullYear() - years);
          // Go back X months
          past_date.setMonth(past_date.getMonth() - months);

          // Find applications paid by this explorer in the period
          calculate_money_spent(res, explorer_id, past_date);
        }
      }
    });

  } else {
    // only period is provided, we return explorers that satisfy a condition over cube:
    if (money === undefined || operator === undefined) {
      res.status(402);
      res.send("Money or query operators must be provided if no explorer is given for a query of type B.");
    } else {

      var period_amount = parseInt(extracted_period.amount);

      if (extracted_period.period === 'Y') {
        // We compute it yearly for the last X amount of years
        var past_date = new Date();
        past_date.setFullYear(past_date.getFullYear() - period_amount);

        explorer_satisfying_cond(res, past_date, operator, money);

      } else {

        // We compute it monthly for the last X amount of months
        var past_date = new Date();

        let years = Math.floor(period_amount / 12);
        let months = period_amount - 12 * years;

        // Go back X years
        past_date.setFullYear(past_date.getFullYear() - years);
        // Go back X months
        past_date.setMonth(past_date.getMonth() - months);

        explorer_satisfying_cond(res, past_date, operator, money);
      }
    }
  }

}

/**
 * Extracts the period parameter so that we can use it's value.
 * @param {*} string_period the parameter denoting the period to compute the calculation for.
 * @returns An object containing the given period (Not allowed if none complies) and the amount of such period.
 */
function extract_period(string_period) {

  var res = { period: false, amount: 'None' };

  if (string_period === undefined) { return res; }

  var yearly = string_period.match(/^Y0[1-3]$/);
  var monthly = string_period.match(/^(M0[0-9]|M[1-2][0-9]|M3[0-6])$/);

  if (yearly !== null && yearly.length > 0) {
    res.period = "Y";
    res.amount = yearly[0].substring(1);
  } else if (monthly !== null && monthly.length > 0) {
    res.period = "M";
    res.amount = monthly[0].substring(1);
  }

  return res;
}

function calculate_money_spent(res, explorer_id, past_date) {
  Application.find({ explorer: explorer_id, paid: true, moment: { $gte: past_date } }).exec(function (err, applications) {
    if (err) {
      res.send(err);
    } else {
      var trip_ids = applications.map(function (application) { return application.trip; });

      // Aggregate the sum of the price of the trips of those applications:
      Trip.aggregate([
        { $match: { _id: { $in: trip_ids } } },
        {
          $group: {
            _id: '',
            total_price: { $sum: "$price" },
          }
        },
        { $project: { _id: 0, total_price: "$total_price" } }
      ],
        function (err, query_result) {
          if (err) {
            res.send(error);
          } else {
            res.status(200);
            res.json(query_result);
          }
        });
    }
  });
}

function explorer_satisfying_cond(res, past_date, operator, money) {
  Application.aggregate([
    { $match: { paid: true, moment: { $gte: past_date } } },
    { $group: { _id: "$explorer", trips: { $push: "$trip" } } },
    {
      $lookup: {
        from: "trips",
        localField: "trips",
        foreignField: "_id",
        as: "trips"
      }
    },
    {
      $project: {
        "money": {
          $reduce: {
            input: "$trips",
            initialValue: 0,
            in: { $sum: ["$$value", "$$this.price"] }
          }
        }
      }
    }]).exec(function (err, agg_res) {
      if (err) {
        res.send(err);
      } else {
        // Filter by those who pass the given condition
        agg_res = agg_res.filter(function (agg_res) { return eval("agg_res.money".concat(operator, money)); });
        res.json(agg_res);
      }
    });
}