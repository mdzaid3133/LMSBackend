import User from "../models/user.models.js";
import AppError from "../utils/error.util.js"


const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    httpOnly: true,
    secure: true,
}

const register = async (req, res, next) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return next(new AppError('All fields are required', 400))
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        return next(new AppError('Email already exist', 404))
    }

    const user = await User.create({
        fullName,
        password,
        email,
        avatar: {
            public_id: email,
            secure_ulr: 'https://res.cloudinary.com/du9jzqlpt/image/uplode'
        }

    });

    if (!user) {
        return next(new AppError('User registration faild please, try again', 404))
    }

    //TODO file uplode taks here

    //hash user password before save user details for securiry purpose by using bcrypt and many more pakege
    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken();

    res.cookie('token', token, cookieOptions)

    res.status().json({
        success: true,
        message: "User registred successfully",
        user,
    })

};

const login = async (req, res,next) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new AppError('All fields are required', 400))
        }

        const user = await User.findOne({email})

         if(!user || user.comparePassword(password)){
            return next(new AppError('Email or Password wrong!',400))

         }
         
         const token = await generateJWTToken();
          user.password = undefined;

          res.cookie('token',token,cookieOptions);

          res.status().json({
            success: true,
               message: "User login successfully",
               user,
          });
          
    } catch (error) {
        return next(new AppError(e.message,500))
    }
};

const logout = (req, res) => {

    res.cookie('token',null,{
        sucure:true,
        maxAge:0,
        httpOnly:true,
    });

    res.status().json({
        success:true,
        message :'User logged out successfully',
    });
};

const getProfile = async(req, res,next) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne({userId});
        
         res.status(200).json({
            success:true,
            message:"User details",
            user,
         })
    } catch (error) {
        return  next(new AppError('Failde to fetch profile details!!',500))
    }

};

export {
    register, login, logout, getProfile
}