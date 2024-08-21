import { mongoose, Schema, model, Types } from "mongoose";

const addressSchema = new mongoose.Schema({
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
 });

const wishlistItemSchema = new Schema({
    product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true
    },
    addedDate: {
        type: Date,
        default: Date.now 
    }
});
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email already exists"],
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    recoveryEmail: {
        type: String
    },
    DOB:{
        type: Date,
    },
    mobileNumber: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    addresses: [addressSchema],
    confirmEmail: {
        type: Boolean,
        default: false
    },
    otp: {
        code: {
            type: String,
        },
        expiresAt: {
            type: Date,
        },
    },
    wishlist: [wishlistItemSchema]
}, { timestamps: true });

userSchema.virtual('username').get(function () {
    return `${this.firstName}_${this.lastName}`.toLowerCase();
});

const User = model('User', userSchema);
export default User;
