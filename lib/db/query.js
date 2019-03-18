import Promise from "promise";
import { dbConnect } from "./db";

let query = {
    request : function(){
        return dbConnect.connect()
        .then(function(data){
            return new Promise((resolve, reject) =>{
                if(data.status !== 1){
                    reject(data);
                }
                else{
                    // 연결 성공 
                    console.log('연결 성공' , data);
                    data.data.connection.release();
                    resolve(data.status);
                }
            });
        });
    },
    insert : function(item){
        return dbConnect.connect()
        .then(function(data){
            return new Promise((resolve, reject) =>{
                if(data.status !== 1){
                    reject(data);
                }
                else{
                    // 연결 성공 
                    
                    // data.data.connection.release();
                    var _conn = data.data.connection;
                    var _sql = 'insert into board_tb values (';
                    _sql += "'" + item.seq + "' , ";
                    _sql += "'" + item.title + "' , ";
                    _sql += "'" + item.cate + "' , ";
                    _sql += "'" + item.date + "' , ";
                    _sql += "'" + item.isNew + "' , ";
                    _sql += "'" + item.isNotice + "' , ";
                    _sql += "'" + item.location + "' , ";
                    _sql += "'" + item.author + "' ); ";

                    console.log(_sql);

                    _conn.query(_sql, function(err, result) {
                        if(err) {
                            _conn.release();
                            reject(err);
                        } 
                        else{
                            resolve({
                                status : 1,
                                mesg : '1 record inserted'
                            });
                            _conn.release();
                        }
                    });
                    // var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
                    // con.query(sql, function (err, result) {
                    //     if (err) throw err;
                    //     console.log("1 record inserted");
                    // });
                }
            });
        });
    }
}

export { query };