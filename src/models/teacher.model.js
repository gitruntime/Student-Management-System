const { throwDeprecation } = require("process")
const db=require("../configs/db.config")
const util=require("util")

const queryAsync = util.promisify(db.query).bind(db)

const teacherCreate = async (data)=>{
    try{
        const { first_name, last_name, email, phone_number, date_of_birth } = data
        const query = "INSERT INTO accounts (first_name,last_name,email,phone_number,date_of_birth) VALUES (?,?,?,?,?)"
        const result = await queryAsync(query,[first_name,last_name,email,phone_number,date_of_birth]);
        return result
    }catch(error){
        throw error
    }
}

const teacherList = async () => {
    try{
        const query="SELECT * FROM permissions WHERE is_staff=?"
        const result=await queryAsync(query,[1])
        return result
    }catch(error){
        throw error
    }
}

const teacherView = async (id)=>{
    try {
        const query="SELECT first_name,last_name, email,phone_number,date_of_birth WHERE id=?";
        const result=await queryAsync(query,id)
        return result
    } catch (error) {
        throw error
    }
}

const teacherUpdate = async (data,id) => {
    const { first_name, last_name, email, phone_number, date_of_birth} =data
    try {
        const query="UPDATE accounts SET first_name=?, last_name=?, email=?, phone_number=?, date_of_birth=? WHERE id=?";
        const result=await queryAsync(query,[first_name,last_name,email,phone_number,date_of_birth,id])
        return result
    } catch (error) {
        throw error
    }
}

const teacherDelete = async (id) => {
    try{
        const query="DELETE FROM accounts WHERE id=?";
        await queryAsync(query,[id])
    }catch(error){
        throw error
    }
}

const teacherEducationList = async (id) => {
    try {
        const query="SELECT e.* FROM accounts a JOIN teachers t ON a.id = t.account_id JOIN educations e ON t.id = e.teacher_id WHERE a.id = ?"
        const data = await queryAsync(query,[id])
        return data
    } catch (error){
        throw error
    }
}

const teacherEducationCreate = async (id,data) => {
    try {
        const teacherQuery = "SELECT id FROM teachers WHERE account_id=?"
        const teacherData = await queryAsync(teacherQuery,[id])
        const { designation,institution,start_date,end_date } = data
        const query="INSERT INTO educations (teacher_id,designation,institution,start_date,end_date) VALUES (?,?,?,?,?)";
        await queryAsync(query,[teacherData.id,designation,institution,start_date,end_date])
    } catch (error) {
        throw error
    }
}

const teacherEducationRetrieve = async (id) => {
    try {
        const query="SELECT id,designation,institution,start_date,end_date FROM educations WHERE id=?";
        const data = await queryAsync(query,[id])
        return data
    } catch (error) {
        throw error
    }
}

const teacherEducationUpdate = async (id,data) => {
   try {
    const { designation,institution,start_date,end_date } = data
    await teacherEducationRetrieve(id)
    const query = "UPDATE educations SET designation=?, institution=?, start_date=?, end_date=? WHERE id=?"
    await queryAsync(query,[designation,institution,start_date,end_date,id])
   } catch (error) {
    throw error
   } 
}

const teacherEducationDelete = async (id) => {
    try {
        const query = "DELETE FROM educations WHERE id = ?"
        await queryAsync(query,[id])
    } catch (error) {
        throw error
    }
}

const teacherExperienceList = async (id) => {
    try {
        const query = "SELECT e.* FROM accounts a JOIN teachers t ON a.id=t.account_id JOIN educations e ON t.id=e.teacher_id WHERE a.id=?"
        const data = await queryAsync(query,[id])
        return data
    } catch (error) {
        throw error 
    }
}

const teacherExperienceCreate = async (id,data) => {
    try {
        const { designation, company, start_date, end_date, is_present } = data
        const query = "INSERT INTO experiences (teacher_id,designation,company,start_date,end_date,is_present) VALUES (?,?,?,?,?,?)";
        const data = await queryAsync(query,[designation,company,start_date,end_date,is_present]);
    } catch (error) { 
        throw error
    }
}

const experienceExperienceView = async (id) => {
    try {
        const query = "SELECT id, designation, company, start_date, end_date, is_present FROM experiences WHERE id = ?";
        const data = await queryAsync(query,[id])
        return data
    } catch (error) {
        throw error
    }
}


module.exports = {
    teacherList,
    teacherCreate,
    teacherView,
    teacherUpdate,
    teacherDelete,
    teacherEducationList,
    teacherEducationCreate,
    teacherEducationRetrieve,
    teacherEducationUpdate,
    teacherEducationDelete
}