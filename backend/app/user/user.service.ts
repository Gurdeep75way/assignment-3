import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";



// Create a new user
export const createUser = async (data: IUser): Promise<IUser> => {
    return await UserSchema.create(data);
};

// Get user by ID
export const getUserById = async (id: string): Promise<IUser | null> => {
    return await UserSchema.findById(id).lean();
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
    return await UserSchema.findOne({ email }).lean();
};


// Update user by ID with full data
export const updateUser = async (id: string, data: IUser): Promise<IUser | null> => {
    const result = await UserSchema.findOneAndUpdate({ _id: id }, data, { new: true }).lean();
    return result;
};


