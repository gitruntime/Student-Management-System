const Auth = require("../models/auth.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/signings/auth.signing");
const  errorHandler  = require("../utils/handlers/error");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await Auth.findUserByEmail(email);
    if (!user)
      return res.status(404).json({
        errors: {
          email: "User with this email not found!",
        },
      });
    if (user.is_superuser && user.password !== password)
      return res
        .status(400)
        .json({ message: "Superuser login credentials are wrong" });

    // Generating Access & Refresh Token using JWT
    let access_token = generateAccessToken(user);
    let refresh_token = generateRefreshToken(user);

    // for now we are not encrypting the superuser password
    if (user.is_superuser && user.password === password) {
      return res
        .status(200)
        .json({
          message: "Superuser logined successfully",
          token: { access_token, refresh_token },
        });
    }
  } catch (error) {
    console.error("Login Error ", error);
  }
};

const permissionList = async (req, res, next) => {  
  try {
    const { page, limit } = req.query
    const args = page && limit ? {page,limit} : {page:null,limit:null}  
    const data = await Auth.permissionList({...args});
    return res.status(200).json({ results: data })
  } catch (error) {
    next(error)
  }
} 
 
const permissionCreate = async (req, res, next) => {
  try {
    const data = await Auth.permissionCreate(req)
    return res.status(201).json({message:"Permission Created Successfully",data})
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') next(errorHandler(400,"Codename already exist"))
    next(error)
  }
}

const permissionView = async (req,res,next) => {
  try {
    const data = await Auth.permissionView(req.params.id)
    if(!data) next(errorHandler(404,"Permission not found.!"))
    return res.status(200).json({data})
  } catch (error) {
    next(error)
  }
}

const permissionUpdate = async (req,res,next) => {
  const {id}=req.params
  try {
    let data=await Auth.permissionView(id)
    if (!data) next(errorHandler(404,"Permission not found.!"))
    data = await Auth.permissionUpdate(req,id)
    return res.status(200).json({data,message:"Permission Updated Successfully"})
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') next(errorHandler(400,"Codename already exist"))
   next(error)
  }
}

const permissionDelete = async (req,res,next) => {
  const { id } = req.params
  try {
    let data=await Auth.permissionView(id)
    if(!data) next(errorHandler(404,"Permission not found.!"))
    data=await Auth.permissionDelete(id)
    console.log(data);
    return res.status(200).json({message:"Permission Deleted Successfully"})
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  permissionList,
  permissionCreate,
  permissionView,
  permissionUpdate,
  permissionDelete
};
