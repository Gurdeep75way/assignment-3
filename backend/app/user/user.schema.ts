import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "./user.dto";

const Schema = mongoose.Schema;


const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Hash only if modified

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});


export default mongoose.model<IUser>("User", UserSchema);