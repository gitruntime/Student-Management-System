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

const permissionList = async () => {
    try {
        const query = 'SELECT * FROM permissions';
        const results= await queryAsync(query)
        console.log(results);
        return results
    } catch (error) {
        console.error(error);   
    }
}

const permissionCreate = async (request) => {
    const { name, codename } = request.body;
    try {
        const query = 'INSERT INTO permissions (name,codename) VALUES (?,?)';
        const [results,] = await queryAsync(query,[name, codename])
        return results
    } catch (error) {
        throw error
    }
}

module.exports={
    findUserByEmail,
    permissionList,
    permissionCreate
}