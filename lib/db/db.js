import Promise from "promise";
import mysql from "mysql";
import config from "./config";

var _connection = -1;
var dbConnect = {
    connect : function(){
        return new Promise((resolve , reject)=>{
            _connection = mysql.createConnection(config);
            _connection.connect(err=>{
                    if(err){ reject({
                        status : 0,
                        mesg : '연결이 실패했습니다',
                        err : err
                    }); 
                }
            });            
            resolve({
                status : 1,
                mesg : '연결에 성공했습니다.',
                data : {
                    connection : _connection
                }
            });
        });
    }
}

export { dbConnect };