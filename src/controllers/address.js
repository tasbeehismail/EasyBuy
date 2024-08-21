import AppError from '../utils/appError.js';
import User from '../models/user.js';

// add address
export const addAddress = async (req, res, next) => {
    const userId = req.user._id;
    const address = req.body;
    const user = await User.findById(userId);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    user.addresses.push(address);
    await user.save();  

    res.status(200).json({ message: 'Address added successfully', data: user });
}

// remove address
export const removeAddress = async (req, res, next) => {
    const userId = req.user._id;
    const addressId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Find the index of the address in the user's addresses
    const addressIndex = user.addresses.findIndex(item => item._id.equals(addressId));

    if (addressIndex === -1) {
        return next(new AppError('Address not found', 404));
    }

    // Remove the address from the user's addresses
    user.addresses.splice(addressIndex, 1);
    await user.save();

    res.status(200).json({ message: 'Address removed successfully', data: user });
}   

// get all addresses
export const getAddresses = async (req, res, next) => {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({ message: 'Addresses retrieved successfully', data: user.addresses });
}

// update address
export const updateAddress = async (req, res, next) => {
    const userId  = req.user._id;
    const addressId = req.params.id;
    const { city, street, country } = req.body;
    const user = await User.findById(userId);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Find the index of the address in the user's addresses
    const addressIndex = user.addresses.findIndex(item => item._id.equals(addressId));

    if (addressIndex === -1) {
        return next(new AppError('Address not found', 404));
    }   

    // Update the address in the user's addresses
    user.addresses[addressIndex].city = city || user.addresses[addressIndex].city;
    user.addresses[addressIndex].street = street || user.addresses[addressIndex].street;
    user.addresses[addressIndex].country = country || user.addresses[addressIndex].country;
    await user.save();

    res.status(200).json({ message: 'Address updated successfully', data: user.addresses[addressIndex] });
}