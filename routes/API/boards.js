var express = require('express');
var router = express.Router();

import { Crawler } from '../../lib/crawler/crawler';
// var Crawler = require('../../lib/crawler/crawler');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.set('Content-Type', 'application/json');
  
  Crawler.get()
  .then(data => { res.send(data); })
  .catch(function(){ 
    console.log(arguments); 
  });
});

module.exports = router;
