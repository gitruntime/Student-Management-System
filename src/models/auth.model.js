const db=require('../configs/db.config');
const util=require("util")

const queryAsync = util.promisify(db.query).bind(db)

const findUserByEmail= async (email) =>{
    try{
        const query='SELECT email,password,is_superuser,is_active FROM accounts WHERE email = ?';
        const [results,]= await queryAsync(query, [email]);
        return results
    } catch (error){
        console.error(error);
    }
}

module.exports={
    findUserByEmail
}