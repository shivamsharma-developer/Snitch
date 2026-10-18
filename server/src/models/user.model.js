import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        // Seller, User
        type: String,
        enum: ["Seller", "User"],
        default: "User"
    },
    refreshToken: {
        type: String
    }
})

const UserModel = mongoose.model("User", userSchema);

export default UserModel;