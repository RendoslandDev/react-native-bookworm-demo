import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },

    profileImage: {
        type: String,
        default: "",
    },
},{timestamps: true});

userSchema.pre("save", function (next) {
    if (this.isModified("password")) return next();
        const salt = bcrypt.genSaltSync(100);
        // Hash the password before saving
        this.password = bcrypt.hashSync(this.password, salt);

    next();
});

userSchema.methods.comparePassword = async function (userPassword) {
    return bcrypt.compareSync(userPassword, this.password);
}
const User = mongoose.model("User", userSchema);

export default User;
