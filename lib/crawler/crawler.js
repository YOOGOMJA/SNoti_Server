import Axios from "axios";
import Promise from "promise";

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
        fetch : function(data){
            return new prm(function(res, rej){

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