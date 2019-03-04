var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080,
  mongoose = require('mongoose'),
  Finder = require('./api/models/finderModel'),
  Actor = require('./api/models/actorModel'),
  Sponsorship = require('./api/models/sponsorshipModel')
  Trip = require('./api/models/tripModel'),
  Application = require('./api/models/applicationModel'),
  Config = require('./api/models/configModel'),
  DataWareHouse = require('./api/models/dataWareHouseModel'), 
  DataWareHouseTools = require('./api/controllers/dataWareHouseController'),
  bodyParser = require('body-parser');
  admin = require('firebase-admin'),
  serviceAccount = require('./acmeexplorerauth-serviceAccountKey.json');

// MongoDB URI building
var mongoDBUser = process.env.mongoDBUser || "myUser";
var mongoDBPass = process.env.mongoDBPass || "myUserPassword";
var mongoDBCredentials = (mongoDBUser && mongoDBPass) ? mongoDBUser + ":" + mongoDBPass + "@" : "";

var mongoDBHostname = process.env.mongoDBHostname || "localhost";
var mongoDBPort = process.env.mongoDBPort || "27017";
var mongoDBName = process.env.mongoDBName || "Acme-Explorer";
var mongoDBURI = "mongodb://" + mongoDBCredentials + mongoDBHostname + ":" + mongoDBPort + "/" + mongoDBName;

mongoose.connect(mongoDBURI, {
  reconnectTries: 10,
  reconnectInterval: 500,
  poolSize: 10, // Up to 10 sockets
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // skip trying IPv6
  useNewUrlParser: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, idToken" //ojo, que si metemos un parametro propio por la cabecera hay que declararlo aquí para que no de el error CORS
  );
  //res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});

var adminConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://acme-explorer-14440.firebaseio.com"
};

admin.initializeApp(adminConfig);

var routesActors = require('./api/routes/actorRoutes');
var routesTrip = require('./api/routes/tripRoutes');
var routesApplication = require('./api/routes/applicationRoutes'); 
var routesSponsorship = require('./api/routes/sponsorshipRoutes'); 
var routesFinder = require('./api/routes/finderRoutes'); 
var routesConfig = require('./api/routes/configRoutes');
var routesDataWareHouse = require('./api/routes/dataWareHouseRoutes');
var routesLogin = require('./api/routes/loginRoutes');



routesActors(app);
routesTrip(app);
routesApplication(app);
routesSponsorship(app);
routesFinder(app)
routesConfig(app);
routesDataWareHouse(app);
routesLogin(app);




console.log("Connecting DB to: " + mongoDBURI);
mongoose.connection.on("open", function (err, conn) {
    app.listen(port, function () {
        console.log('Acme-Explorer RESTful API server started on: ' + port);
    });
});

// mongoose.connection.dropDatabase()

mongoose.connection.on("error", function (err, conn) {
    console.error("DB init error " + err);
});


DataWareHouseTools.createDataWareHouseJob();
