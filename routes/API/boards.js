var express = require('express');
var router = express.Router();

import { Crawler } from '../../lib/crawler/crawler';
import { prependOnceListener } from 'cluster';
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

router.get('/search_options' , function(req, res, next){

});

router.post('/get' , function(req, res, next){
  res.set('Content-Type' , 'application/json');


});

router.get('/example' , function(req, res, next){
  var __TEST_DATA = {};
  __TEST_DATA.status = 'SUCCESS';
  __TEST_DATA.data = [];
  var mails = ['gmail.com' , 'naver.com' , 'hotmail.com' , 'hanmail.net' , 'syu.ac.kr'];
  for(var i = 0 ; i < 20 ; i++){
    var person = {};
    person.seq = i;
    person.name = 'person_' + i;
    person.hp = '010-' + (Math.floor((Math.random() * 9000) + 1000)) + '-' + (Math.floor((Math.random() * 9000) + 1000));
    person.mail = person.name + '@' + mails[Math.floor((Math.random()) * 5)];
    person.grade = Math.floor(Math.random() * 4) + 1;
    person.age = Math.floor(Math.random() * 50) + 10;
    __TEST_DATA.data.push(person);
  }
  
  res.set('Content-Type' , 'application/json');
  res.send(
    __TEST_DATA
  );
});

module.exports = router;
