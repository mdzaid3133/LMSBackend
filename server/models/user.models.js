import {model,Schema} from "mongoose";
import bcrypt from "bcryptjs";
import JWT from 'jsonwebtoken';
const userSchema = new Schema({
    fullName: {
        type: 'String',
        required: [true, "Name is required"],
        minLength: [5, "Name should be less than 5 characters"],
        maxLength: [50, "Name should be less than 50 characters"],
        lowercase: true,
        trim: true,
    },
    email: {
        type: 'String',
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        unique: true,

    },
    password: {
        type: 'String',
        required: [true, "Password is required"],
        minLength: [8, "Password mast be at least  8 characters"],
        select: false,
    },
    avatar:{
        public_id:{
            type: "String",
        }
    },
    role:{
        type: 'String',
        enum: ['USER','ADMIN'],
        default: 'USER',
    },
    forgotPasswordToken:{
        type: 'String',
    },
    forgotPasswordExpiry:{
        type: Date,
    }
},{timestamps :true});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password,10);
});

userSchema.method = {
    generateJWTToken: async function(){
       return await JWT.sign({
        id:this.id,
        email:this.email,
        subscription:this.subscription,
        role:this.role,
       },
       process.env.JWT_SECRET,
       {
        expiresIn:process.env.JWT_EXPIRY,
       }

       )
    },

    comparePassword : async function(planeTextPassword){
         return await bcrypt.compare(planeTextPassword,this.password)
    }

}

const User = model('User',userSchema);

export default User;