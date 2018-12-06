import Axios from "axios";
import Promise from "promise";
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from "constants";
import {JSDOM} from 'jsdom';
// import { rejects } from "assert";

const meta = {
    url : 'https://new.syu.ac.kr/academic/academic-notice/',
    css : {
        root : '.md_notice_tbl',
        no_area : '.step1',
        title_area : '.step2',
        author_area : '.step3',
        date_area : '.step4',
        attach_area : '.step5',
        cnt_area : '.step6',
        notice_icon : '.notice_icon',
        cate : '.md_cate',
        title : '.tit',
        new : '.md_new',
        paging_area : '.md_pagingbx'
    },
    // 실제 문장 쿼리스트링
    query : {
        cate : 't',
        type  : 'c',
        keyword : 'k'
    },
    // 조회에 사용되는 옵션들 
    options : {
        cate : [
            { text : '전체' , val : '' },
            { text : '수업' , val : '수업' },
            { text : '학적' , val : '학적' },
            { text : '등록' , val : '등록' },
            { text : '채플' , val : '채플' },
        ],
        type : [
            { text : '전체' , val : '' },
            { text : '제목' , val : '제목' },
            { text : '내용' , val : '내용' },
        ]
    }
}

let Crawler = (function(Axios , meta, prm){

    let fn = {
        get : function(meta, opts){
            return new Axios({
                method : 'GET',
                url : meta.url,
                params : opts
            });
        },
        fetch : function(response){
            // data
            return new prm(function(resolve, reject){
                // 1. 데이터 관리                 
                let result = [];
                let _jsd = new JSDOM();
                let dom = _jsd.window.document.createElement('div');
                dom.innerHTML = response.data;

                let rows = dom.querySelector(meta.css.root).querySelectorAll('tr');
                if(rows.length <= 1){ 
                    reject({
                        code : -1,
                        mesg : 'dom 요소가 없거나, 테이블이 존재하지 않습니다.',
                        data : {
                            items : [],
                            paging : []
                        }
                    });
                }
                else{
                    rows.forEach(row =>{
                        let item = {};
                        if(row.querySelector(meta.css.no_area)){
                            
                            // 1. 글번호 
                            let cont_no = row.querySelector(meta.css.no_area);
                            if(cont_no.querySelector(meta.css.notice_icon)){
                                item.seq = -1;
                                item.isNotice = true;
                            }
                            else{
                                item.seq = Number(cont_no.textContent);
                                item.isNotice = false;
                            }
                            
                            // 2. 글 제목
                            
                            let title = row.querySelector(meta.css.title_area);
                            item.title = title.querySelector(meta.css.title).textContent;
                            item.cate = title.querySelector(meta.css.cate) ? title.querySelector(meta.css.cate).textContent : '';
                            item.location = title.querySelector('a').href;
                            item.isNew = title.querySelector(meta.css.new) ? true : false;

                            // 3. 작성자
            
                            let author = row.querySelector(meta.css.author_area);
                            item.author = author.textContent;
                        
                            // 4. DATE
                            let date = row.querySelector(meta.css.date_area);
                            item.date = date.textContent;
                        }else{
                            // 목차
                        }

                        result.push(item);
                    });

                }

                resolve({
                    code : 1,
                    mesg : '조회되었습니다',
                    data : {
                        items : result,
                        paging : []
                    }
                });

            //     // PAGING
            //     // 페이징 정보가 페이지에 따로 있으므로 그걸 그대로 가져옴 
            //     mod.paging = {};
            //     mod.paging.data = [];
            //     mod.paging.last = 1;
            //     let paging_container = mod.dom.find(meta.css.paging_area);
            //     if(paging_container.length <= 0){
            //         // 페이징이 없는 경우에는 비워서 보낸다
            //         mod.paging.data = [];
            //         mod.paging.last = 1;
            //     }
            //     else{
            //         let paging = paging_container.find('li').not('.icon_item');
            //         paging.map(function(idx){
            //             let page = paging.eq(idx);
            //             let item = {};

            //             item.val = Number(page.text());
            //             item.selected = page.text() === paging_container.find('ul').attr('data-current-paged');
            //             mod.paging.data.push(item);
            //         });

            //         let last_elem = paging_container.find('.last a').attr('href');
            //         last_elem = last_elem.replace(config.url, '');
            //         last_elem = last_elem.split('?')[0];
            //         last_elem = last_elem.replace(/\//g,'').replace('page','');

            //         mod.paging.last = Number(last_elem);
            //     }
            //     dfd.resolve(mod.arr, mod.paging);
                

            });
        }
    }

    return {
        get : function(prms){
            let opts = {};
            return fn.get(meta, opts).then(fn.fetch);
        },
        opts : {
            IDENTIFIER : {
                'SEARCH_CATEGORIES' : 'SEARCH_CATEGORIES',
                'SEARCH_TYPES' : 'SEARCH_TYPES' 
            },
            get : function(id){
                let copied = [];
                switch (id){
                    case this.IDENTIFIER.SEARCH_CATEGORIES:
                        copied = meta.options.cate.slice(0,meta.options.cate.length);
                    break;
                    case this.IDENTIFIER.SEARCH_TYPES:
                        copied = meta.options.type.slice(0,meta.options.type.length);
                    break;
                    default:
                    break;
                }
                return copied;
            },
            getCate : function(){
                return this.get(this.IDENTIFIER.SEARCH_CATEGORIES);
            },
            getType : function(){
                return this.get(this.IDENTIFIER.SEARCH_TYPES);
            }
        }
    }
})(Axios, meta, Promise);

export { Crawler };