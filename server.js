var express = require('express');
var app = express();
var speakeasy = require("speakeasy");
var sdk = require('messagemedia-messages-sdk');
var controller = sdk.MessagesController;
const ejs = require('ejs');
var bodyParser = require("body-parser");

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/public'));

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var secret = speakeasy.generateSecret({length: 20});

app.get('/', function(req, res){
  res.render('index');
});

app.post("/register", urlencodedParser, function (req, res) {
  var token = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32'
  });
  
  sdk.Configuration.basicAuthUserName = process.env.KEY; 
  sdk.Configuration.basicAuthPassword = process.env.SECRET; 

  var body = new sdk.SendMessagesRequest({
      "messages":[
          {
              "content":"Your MessageMedia security code is: "+token,
              "destination_number":req.body.mobile
          }
      ]
  });
  
  controller.createSendMessages(body, function(error, response, context) {
    if (!error){
      res.render("verify");
    } else {
      res.send(error);
    }
  });
  
});

app.post("/verify", urlencodedParser, function (req, res) {
  var userCode = req.body.code;
  var tokenValidates = speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: userCode,
    window: 6
  });
  res.send(tokenValidates);
});

var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});