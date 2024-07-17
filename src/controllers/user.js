import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../services/auth.service.js';
import AppError from '../utils/appError.js';
import { sendOTP, verifyOTP as verify } from '../services/otp.service.js';
import resetPasswordEmailTemplate from '../view/resetPasswordEmail.js';
import verifyEmailTemplate from '../view/verifyEmail.js';
/**
 * @description Signup a new user
 * @route POST /users/signup
 * @access Public
 * @param {object} req - Express request object containing user details
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const signup = async (req, res, next) => {
    // Hash the password
    let { password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 10);
    req.body.password = hashedPassword;
    // Create a new user
    const user = new User({ ...req.body });
    await user.save();
    // Send OTP for email verification
    await sendOTP(user, 'Email Verification', verifyEmailTemplate);
    // Remove sensitive data before sending response
    user.password = undefined;
    user.otp = undefined;

    res.status(201).json({ message: 'User created successfully. Verification email sent.', data: user });
}
/**
 * @description Login a user
 * @route POST /users/login
 * @access Public
 * @param {object} req - Express request object containing login details
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const login = async (req, res, next) => { 
    const  {loginField, password} = req.body;
    // Find user by email, recovery email, or mobile number
    let user = await User.findOne({
        $or: [
            { email: loginField },
            { recoveryEmail: loginField },
            { mobileNumber: loginField }
        ],
    });
    // Check if user exists and password is correct
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return next(new AppError('Invalid login credentials', 401));
    }
    // Check if email is verified
    if (!user.confirmEmail) {
        return next(new AppError('Email not verified. Please verify your email first.', 401));
    }
    // Generate a token
    const payload = { id: user._id, email: user.email, tokenType: 'access' };
    const token = generateToken(payload);
    
    await user.save();

    return res.status(200).json({ message: 'User logged in successfully', Token: token });
}
/**
 * @description Verify user's email
 * @route POST /users/verify-email
 * @access Public
 * @param {object} req - Express request object containing email and OTP
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const verifyEmail = async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    // Check if user exists
    if (!user) {
       return next(new AppError('Invalid email', 404));
    }
    // Check if OTP is valid
    const result = await verify(user, otp);
    if (!result.success) {
        return next(new AppError(result.message, 400));
    }
    // Update email confirmation status
    user.confirmEmail = true;
    await user.save();

    res.status(200).json({ message: result.message });
};
/**
 * @description Request password reset
 * @route POST /users/forgot-password
 * @access Public
 * @param {object} req - Express request object containing user's email
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Send OTP for password reset
    await sendOTP(user, 'Password Reset Request', resetPasswordEmailTemplate);

    res.status(200).json({ message: 'Password reset email sent' });
}
/**
 * @description Reset user's password
 * @route POST /users/reset-password
 * @param {object} req - Express request object containing new password, OTP, and email
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const resetPassword = async (req, res, next) => {
    const { newPassword, otp, email } = req.body;
    const user = await User.findOne({ email });
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if OTP is valid
    const result = await verify(user, otp);
    if (!result.success) {
        return next(new AppError(result.message, 400));
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
}
/**
 * @description Get current logged-in user's details
 * @route GET /users/me
 * @access Private
 * @param {object} req - Express request object containing user details
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const getMe = async (req, res, next) => {
    const user = req.user;
    // Check if user exists
    if(!user){
        return next(new AppError('User not found', 404));
    }
    // Remove sensitive data before sending response
    user.password = undefined;
    user.otp = undefined;

    res.status(200).json({ data: user });
}
/**
+ * @description Get other user's profile
+ * @route GET /users/account/:id
+ * @access Private
+ * @param {object} req - Express request object containing user ID
+ * @param {object} res - Express response object
+ * @param {function} next - Express next middleware function
+ */
export const getOtherUser = async (req, res, next) => {
    const { id } = req.params;
    // Exclude password, otp, and confirmEmail from response
    const user = await User.findById(id).select('-password -otp -confirmEmail');  
    // Check if user exists
    if(!user){
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({ data: user });
}

/**
 * @description Update current user's account details
 * @route PATCH /users/account
 * @access Private
 * @param {object} req - Express request object containing updated user details
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const updateAccount = async (req, res, next) => {
    const { email, mobileNumber, recoveryEmail, firstName, lastName, DOB, addresses } = req.body;
    const user = req.user;
    // Check if user exists
    if(!user){
        return next(new AppError('User not found', 404));
    }
    // Update user details
    user.email = email || user.email;
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.recoveryEmail = recoveryEmail || user.recoveryEmail;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.DOB = DOB || user.DOB;
    // Update addresses
    if (addresses && Array.isArray(addresses)) {
        // Filter out any addresses that already exist in user.addresses
        const newAddresses = addresses.filter(newAddr => {
            return !user.addresses.some(existingAddr =>
                existingAddr.street === newAddr.street && // Compare by street as an example
                existingAddr.city === newAddr.city // Add more fields as needed
            );
        });

        // Append unique new addresses to user.addresses
        user.addresses.push(...newAddresses);
    }
    await user.save();
    // Remove sensitive data before sending response
    user.password = undefined;
    user.otp = undefined;

    res.status(200).json({ data: user });
}
/**
 * @description Delete current user's account
 * @route DELETE /users/account
 * @access Private
 * @param {object} req - Express request object containing user details
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const deleteAccount = async (req, res, next) => {
    const userId = req.user._id;
    if(!userId){
        return next(new AppError('User not found', 404));
    }
    // Delete the user
    await User.findByIdAndDelete(userId);
    res.status(200).json({
        message: 'User account deleted successfully',
    });
}

/**
 * @description Update the current user's password
 * @route PATCH /users/password
 * @access Private
 * @param {object} req - Express request object containing current and new passwords
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const updatePassword = async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    // Check if user exists
    if(!user){
        return next(new AppError('User not found', 404));
    }
   // Verify if current password matches the stored password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if(!isMatch){
        return next(new AppError('Current password is incorrect', 400));
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
}
