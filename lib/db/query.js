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
                    console.log('연결 성공');
                    data.data.connection.release();
                    resolve(data.status);
                }
            });
        });
    }
}

export { query };