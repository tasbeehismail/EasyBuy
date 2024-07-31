import User from '../models/user.js';
import AppError from '../utils/appError.js';

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
