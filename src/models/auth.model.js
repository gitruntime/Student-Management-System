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
        throw error
    }
}

const permissionCreate = async (request) => {
    const { name, codename } = request.body;
    try {
        const query = 'INSERT INTO permissions (name,codename) VALUES (?,?)';
        const result = await queryAsync(query,[name, codename])
        return result
    } catch (error) {
        throw error
    }
}

const permissionView = async (id) =>{
    try {
        const query="SELECT * FROM permissions WHERE id=?"
        const [result,] = await queryAsync(query,[id])
        return result
    } catch (error) {
        throw error
    }
}

const permissionUpdate = async (request,id) => {
    const { name, codename } = request.body
    try {
        const query = "UPDATE permissions SET name=? ,codename=? WHERE id=?";
        await queryAsync(query,[name,codename,id])
        const result = await permissionView(id)
        return result;
    } catch (error) {
        throw error
    }
}

const permissionDelete = async (id) => {
    try {
        const query= "DELETE FROM permissions WHERE id=?";
        const result = await queryAsync(query,[id])
        console.log(result);
        return result
    } catch (error) {
        throw error
    }
}
module.exports={
    findUserByEmail,
    permissionList,
    permissionCreate,
    permissionView,
    permissionUpdate,
    permissionDelete
}