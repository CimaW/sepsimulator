var express = require('express');
var router = express.Router();
var mime = require('mime');
var bodyParser = require('body-parser')
var randomstring = require("randomstring");
var request = require('request');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET OK */
router.get('/ok', function(req, res, next) {
  res.render('ok');
});

/* GET 408 time out 3 secondi*/
var HC408_s3 = function (req, res) {
  setTimeout(function(){
  res.sendStatus(408);
  }, 3000);
};

router.get('/HC408_s3', HC408_s3);
router.post('/HC408_s3', HC408_s3);

/* GET 403 time out 3 secondi*/
var HC403 = function (req, res) {
  res.sendStatus(403);
};

router.get('/HC403', HC403);
router.post('/HC403', HC403);

/* GET 404 */
var HC404 = function (req, res) {
  res.sendStatus(404);
};

router.get('/HC404', HC404);
router.post('/HC404', HC404);

/* GET 500 */
var HC500 = function (req, res) {
  res.sendStatus(500);
};

router.get('/HC500', HC500);
router.post('/HC500', HC500);

/* Risposta simulata sdi*/
var dateFormat = require('dateformat');

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

var HC_SDI = function (req, res) {
  var numbers =randomIntInc(1,100000000000);
  var now = new Date();
  var day=dateFormat(now, "yyyymmddHHMMss");
  var day2=dateFormat(now, "yyyymmdd");
  res.set("Content-Type", "application/xml");
  setTimeout(function(){
  res.send("<ResultData><ResultType>ACK</ResultType><InterfaceId>MSP</InterfaceId><ResultNum>1</ResultNum> <TransactionId>"+numbers+"</TransactionId><ResultTime>"+day+"</ResultTime><Result>0</Result><Info/></ResultData>");
  }, 150);
var fs = require('fs');
fs.appendFile(day2, numbers+"\n" , function(err) {
    if(err) {
        return console.log(err);
    }
  });
};

router.get('/sdi', HC_SDI);
router.post('/sdi', HC_SDI);

var HC_PROVIDER = function (req, res) {
  var app = express();
  var now = new Date();
  var day=dateFormat(now, "yyyy-mm-dd_HH:MM:ss");
  var day3=dateFormat(now, "yyyymmdd");
  const querystring = require('querystring');
  var url = require("url");
  //var PROVIDER = JSON.stringify(req.headers);
  //var PROVIDER = JSON.stringify(req.body);
  //var PROVIDER = req.query;

 //app.use(bodyParser.json({ type: 'application/*+json' }))
 //app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
 //app.use(bodyParser.text({ type: 'text/html' }))

  var QUERY = querystring.stringify(req.query);
  var HEADER = JSON.stringify(req.headers);
  var BODY = JSON.stringify(req.body);
 //const risu = JSON.stringify(req.query)

  res.set("Content-Type", "text/plain");
  res.send("0");
  var fs = require('fs');
  var numbers =randomIntInc(1,100000000000);
  fs.appendFile("Provider_body_"+day3,
                "#########################\n"+
                day+"_"+numbers+" METODO:"+req.method+"\n"+
                day+"_"+numbers+" URI:"+QUERY+"\n"+
                //"HEADER:"+HEADER+"\n"+
                day+"_"+numbers+" BODY:"+BODY+"\n"+
                "#########################\n"
                , function(err) {
    if(err) {
        return console.log(err);
    }
  });
};

router.get('/provider', HC_PROVIDER);
router.post('/provider', HC_PROVIDER);

var HC_SEP = function (req, res) {
  var numbers =randomstring.generate(31);
  var now = new Date();
  var day=dateFormat(now, "yyyymmddHHMMss");
  var day2=dateFormat(now, "yyyymmddHHMM");
  res.set("Content-Type", "application/xml");
  setTimeout(function(){
  res.send("<ResultData><ResultType>ACK</ResultType><InterfaceId>SEP</InterfaceId><ResultNum>4</ResultNum><TransactionId number=\"1\">"+numbers+"</TransactionId><ResultTime number=\"1\">"+day+"</ResultTime><Result number=\"1\">0</Result><Info number=\"1\"/></ResultData>");
  }, 150);
var fs = require('fs');
fs.appendFile(day2+'.sep', day+','+numbers+"\n" , function(err) {
    if(err) {
        return console.log(err);
    }
  });
};

router.get('/sep', HC_SEP);
router.post('/sep', HC_SEP);

var headers = {
    'Content-Type': 'text/xml; charset=utf-8',
    'Accept': 'application/soap+xml, application/dime, multipart/related, text/*',
    'User-Agent': 'Axis/1.1',
    'Host': 'membership.libero.it',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'SOAPAction':' '
}
var HC_SEPBE = function (req, res) {
  var numbers =randomstring.generate(31);
  var now = new Date();
  var day=dateFormat(now, "yyyymmddHHMMss");
  var day2=dateFormat(now, "yyyymmddHHMM");
  res.setHeader('Content-Type', 'application/json');
  setTimeout(function(){
  res.json({a:"TEST"  });
  }, 270);
  setTimeout(function(){
	//console.log(req.headers);
        if(req.headers.nt =="1"){
		var TID=req.headers["sdi-tid"];
        var now=new Date();
        console.log(now+" "+TID);
          if (TID !== null) {
        var options = {
                url: 'http://10.139.70.31:8000/smsnothandler/forwardDRtoProvider/LA_4322_srs001018005+WindInternal',
                method: 'POST',
                headers: headers,
                form:  '{"deliveryInfoNotification":{"callbackData":"http://cmp-mgm-sms-a-50.wind.root.it:8080/notificaTCRM/run|'+TID+'|LA_4322_dcd001705","deliveryInfo":[{"address":"tel:+393204243468","deliveryStatus":"DeliveredToTerminal"}]}}'
                }

        request(options, function (error, response, body) {
                })
}
			
		}
	}, 450);
};

router.get('/sepbe', HC_SEPBE);
router.post('/sepbe', HC_SEPBE);
router.get('/oneapi*', HC_SEPBE);
router.post('/oneapi*', HC_SEPBE);

/* GET OK dalay passato in query string*/
var HC200 = function (req, res) {
  setTimeout(function(){
  res.sendStatus(200);
  }, req.params.delay);
};


router.get('/:delay', HC200);
router.post('/:delay', HC200);


module.exports = router;
