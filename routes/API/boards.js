var express = require('express');
var router = express.Router();

import { Crawler } from '../../lib/crawler/crawler';
import { prependOnceListener } from 'cluster';
import { createDeflateRaw } from 'zlib';
import { query } from '../../lib/db/query';
import { FORMERR } from 'dns';

let _CRAWLER_PAGE = 1;
let _CRAWLER_WORKING = false;
let _CRAWLER_LAST_PAGE = -1;
let _CRAWLER_STOP_IMMEDIATELY = false;

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

router.get('/options' , function(req, res, next){
  res.set('Content-Type' , 'application/json');
  
  var __DATA = {};
  __DATA.CATEGORIES = Crawler.opts.getCate();
  __DATA.TYPES = Crawler.opts.getType();

  res.send(__DATA);
});

router.post('/get' , function(req , res, next){
  res.set('Content-Type' , 'application/json');
  Crawler.get(req.body)
  .then(data => { res.send(data); })
  .catch(function(){ 
    console.log(arguments); 
  });
});

router.get('/get' , function(req, res, next){
  res.set('Content-Type' , 'application/json');
  console.log(req.query);
  Crawler.get(req.query)
  .then(data => { res.send(data); })
  .catch(function(){ 
    console.log(arguments); 
  });
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

router.get('/crawl/stop' , function(req,res,next){
  res.set('Content-Type' , 'application/json');
  if(_CRAWLER_WORKING){
    _CRAWLER_STOP_IMMEDIATELY = true;

    res.send({
      status : 1,
      mesg : '크롤링이 곧 중단됩니다'
    });
  }
  else{
    res.send({
      status : 0,
      mesg : '작동 중인 크롤링 프로세스가 없습니다'
    });
  }

});

router.get('/crawl/start' , function(req, res, next){
  res.set('Content-Type' , 'application/json');

  // query.request()
  // .then(function(data){
  //   console.log(data);
  //   // res.send(data);
  //   console.log('Hello wOrld');
  //   res.send({});
  // } , function(data){
  //   res.send(data);
  // });


  if(!_CRAWLER_WORKING){
    res.send({ 
      status : 1,
      mesg : '크롤링 시작'
    });
    _CRAWLER_WORKING = true;
    _CRAWLER_PAGE = 1;
    
    crawling();
  }
  else{
    res.send({
      status : 1,
      mesg : '이미 크롤러가 작동중입니다. 현재 조회 페이지 : ' + _CRAWLER_PAGE,
    });
  }
});

/// crawler 
function crawling(){
  if(_CRAWLER_STOP_IMMEDIATELY){ 
    console.log('크롤링이 중단되었습니다. 현재 페이지 : ' +_CRAWLER_PAGE);
    _CRAWLER_WORKING = false;
    _CRAWLER_STOP_IMMEDIATELY = false;
    return; 
  }
  console.log('page : ' + _CRAWLER_PAGE + ' / ' + _CRAWLER_LAST_PAGE);

  Crawler.get({
    page : _CRAWLER_PAGE
  })
  .then(data => {
    return new Promise((resolve , reject)=>{
      _CRAWLER_LAST_PAGE = data.data.paging.last;
      _CRAWLER_PAGE++;
      if(_CRAWLER_PAGE <= _CRAWLER_LAST_PAGE){
        // crawling();
        resolve({
          status : 1,
          mesg : '진행중',
          items : data.data.items
        });
      }
      else{
        _CRAWLER_WORKING = false;
        console.log('finished!' , test.length);
        resolve({
          status : 0,
          mesg : '종료'
        });
      }
    });
  })
  .then(function(data){
    if(data.status === 1){
      // for(var i = 0 ; i < data.items.length ; i++){
      //   console.log(data.items[i].title);
      // }

      query.insert(data.items[0]);

    }
    else if(data.status === 0){
      console.log('종료!');
    }
    else{
      console.log('오류 발생' , data);
    }
  });
}

function insert(item){

}

module.exports = router;
