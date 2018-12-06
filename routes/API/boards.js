var express = require('express');
var router = express.Router();

import { Crawler } from '../../lib/crawler/crawler';
// var Crawler = require('../../lib/crawler/crawler');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  
  res.set('Content-Type', 'application/json');
  
  console.log(Crawler.get);
  Crawler.get()
  .then(data => { res.send(data); })
  .catch(function(){ 
    console.log(arguments); 
  });
});

module.exports = router;
