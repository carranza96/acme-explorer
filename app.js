var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080,
  mongoose = require('mongoose'),
  Finder = require('./api/models/finderModel'),
  Actor = require('./api/models/actorModel'),
  Sponsorship = require('./api/models/sponsorshipModel'),
  Trip = require('./api/models/tripModel'),
  Application = require('./api/models/applicationModel'),
  Config = require('./api/models/configModel'), // Singleton
  DataWareHouse = require('./api/models/dataWareHouseModel'),
  DataWareHouseTools = require('./api/controllers/dataWareHouseController'),
  bodyParser = require('body-parser');

// MongoDB topology manager
const { ReplSet } = require('mongodb-topology-manager');

// MongoDB URI building
var mongoDBUser = process.env.mongoDBUser || "myUser";
var mongoDBPass = process.env.mongoDBPass || "myUserPassword";
var mongoDBCredentials = (mongoDBUser && mongoDBPass) ? mongoDBUser + ":" + mongoDBPass + "@" : "";

var mongoDBHostname = process.env.mongoDBHostname || "localhost";
var mongoDBPort = process.env.mongoDBPort || "27017";
var mongoDBName = process.env.mongoDBName || "Acme-Explorer";
var mongoDBURI = "mongodb://" + mongoDBCredentials + mongoDBHostname + ":" + mongoDBPort + "/" + mongoDBName;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routesActors = require('./api/routes/actorRoutes');
var routesTrip = require('./api/routes/tripRoutes');
var routesApplication = require('./api/routes/applicationRoutes');
var routesSponsorship = require('./api/routes/sponsorshipRoutes');
var routesFinder = require('./api/routes/finderRoutes');
var routesConfig = require('./api/routes/configRoutes');
var routesDataWareHouse = require('./api/routes/dataWareHouseRoutes');

routesActors(app);
routesTrip(app);
routesApplication(app);
routesSponsorship(app);
routesFinder(app)
routesConfig(app);
routesDataWareHouse(app);

run().then(function () {
  /*We will watch all connections which alter the DataWareHouse and re-calculate it if any of them changes. 
  I don't think this is a good practice if our system has a high volume of operations.*/
  Actor.watch().
    on('change', function (data) {
      console.log(new Date(), "Actor changed, updating DataWarehouse...");
      DataWareHouseTools.computeDataWareHouse();
    });

  Trip.Trip.watch().
    on('change', function (data) {
      console.log(new Date(), "Trip changed, updating DataWarehouse...");
      DataWareHouseTools.computeDataWareHouse();
    });

  Finder.watch().
    on('change', function (data) {
      console.log(new Date(), "Finder changed, updating DataWarehouse...");
      DataWareHouseTools.computeDataWareHouse();
    });
}).catch(error => console.error(error));

mongoose.connection.on("open", function (err, conn) {
  app.listen(port, function () {
    console.log('Acme-Explorer RESTful API server started on: ' + port);
  });
});

// mongoose.connection.dropDatabase()

mongoose.connection.on("error", function (err, conn) {
  console.error("DB init error " + err);
});

//DataWareHouseTools.createDataWareHouseJob();

// Defined functions:
async function run() {
  // Make sure you're using mongoose >= 5.0.0
  console.log(new Date(), `mongoose version: ${mongoose.version}`);

  // Important!: Comment it if you already ran it once!
  await setupReplicaSet();

  // Connect to the replica set
  const uri = 'mongodb://localhost:31000,localhost:31001,localhost:31002/' +
    'Acme-Explorer?replicaSet=rs0';

  console.log(new Date(), "Attenting to connect to DB: " + uri);

  await mongoose.connect(uri,
    {
      reconnectTries: 10,
      reconnectInterval: 500,
      poolSize: 10, // Up to 10 sockets
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // skip trying IPv6
      useNewUrlParser: true
    });

  console.log("Connection stablished!");
}

// Boilerplate to start a new replica set. You can skip this if you already
// have a replica set running locally or in MongoDB Atlas.
async function setupReplicaSet() {
  const bind_ip = 'localhost';
  // Starts a 3-node replica set on ports 31000, 31001, 31002, replica set
  // name is "rs0".
  const replSet = new ReplSet('mongod', [
    { options: { port: 31000, dbpath: `${__dirname}/data/db/31000`, bind_ip } },
    { options: { port: 31001, dbpath: `${__dirname}/data/db/31001`, bind_ip } },
    { options: { port: 31002, dbpath: `${__dirname}/data/db/31002`, bind_ip } }
  ], { replSet: 'rs0' });

  // Initialize the replica set
  await replSet.purge();
  await replSet.start();
  console.log(new Date(), 'Replica set started...');
}