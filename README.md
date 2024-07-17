# EasyBuy

## Project Overview

The platform is designed to facilitate seamless online shopping experiences for users while providing efficient product management for administrators.

---

## Table of Contents
- [Requirements](#requirements)
- [Database Design](#database-design)
  - [Overview](#overview)
  - [Schema Diagram](#schema-diagram)
  - [Collections](#collections)
- [API Documentation](#api-documentation)

---

## Requirements

### User Management

- **Registration and Authentication**
  - Users can register with their first name, last name, email, password, and date of birth.
  - Email verification for account activation.
  - Password recovery options via recovery email and OTP-based reset.
  
- **Profile Management**
  - Users can view and update their profile information.
  - Address management with support for multiple addresses.
  - Role-based access control (user and admin roles).
  - Ability to block users from making purchases if they cancel an order, requiring them to use a card for future purchases.
  
### Product Management

- **Product Operations**
  - Admins can perform CRUD operations on products.
  - Products have attributes such as name, description, price, discount, etc.
  
- **Category and Brand Management**
  - Categories and sub-categories for organizing products.
  - Brands can be created with a name and associated logo.

### Order Management

- **Cart and Order Operations**
  - Users can add, update, and remove items from their cart.
  - Order placement, tracking (pending, shipped, delivered, cancelled), and history.

### Coupon Management

- **Coupon Operations**
  - Admins can create coupons with codes, discounts, expiry dates, and usage limits.
  - Users can apply coupons to their orders for discounts.

### Search and Filter

- **Product Search**
  - Users can search for products by name, category, brand, etc.
  - Advanced filtering and sorting options based on price, discount, rating, etc.

### Reporting and Analytics

- **Reporting**
  - Generate sales reports, user activity reports, and analyze product performance.

---

## Database Design

### Overview

The database utilizes MongoDB with collections structured as follows:

- **Users**: Stores user information including profiles and addresses.
- **Products**: Contains product details, categories, brands, and associated images.
- **Categories**: Organizes products into main categories and sub-categories.
- **Brands**: Stores brand information including logos.
- **Orders**: Tracks user orders with details on products, quantities, and statuses.
- **Reviews**: Stores user reviews and ratings for products.
- **Carts**: Manages user shopping carts with products and quantities.
- **Coupons**: Stores coupon details including codes, discounts, and usage limits.

### Schema Diagram

![Database Schema Diagram](https://github.com/tasbeehismail/EasyBuy/blob/main/docs/schema-diagram.png)

### Collections

#### **User Model**

| Field         | Type    | Constraints                        |
| ------------- | ------- | ---------------------------------- |
| firstName     | String  | required: true, minLength: 2, maxLength: 50 |
| lastName      | String  | required: true, minLength: 2, maxLength: 50 |
| email         | String  | required: true, unique: true, match: /.+@.+\..+/ |
| password      | String  | required: true, minLength: 8       |
| recoveryEmail | String  | match: /.+@.+\..+/                 |
| DOB           | Date    | required: true                     |
| mobileNumber  | String  | unique: true, match: /^[0-9]{10,15}$/ |
| confirmEmail  | Boolean | default: false                     |
| role          | String  | enum: ['user', 'admin'], default: 'user' |
| isBlocked     | Boolean | default: false                     |
| addresses     | [Object] |                                    |
| addresses.street | String | required: true                    |
| addresses.city | String | required: true                     |
| addresses.zip | String  | required: true                     |
| addresses.country | String | required: true                  |
| createdAt     | Date    | default: Date.now                  |
| updatedAt     | Date    | default: Date.now                  |

#### **Category Model**

| Field       | Type    | Constraints                        |
| ----------- | ------- | ---------------------------------- |
| name        | String  | required: true, unique: true, minLength: 2, maxLength: 50 |
| slug        | String  | required: true, unique: true       |
| image       | String  | required: true, match: /^(http|https):\/\/[^\s]+$/ |
| createdAt   | Date    | default: Date.now                  |
| updatedAt   | Date    | default: Date.now                  |

#### **Sub-Category Model**

| Field       | Type    | Constraints                        |
| ----------- | ------- | ---------------------------------- |
| name        | String  | required: true, minLength: 2, maxLength: 50 |
| slug        | String  | required: true, unique: true       |
| parentCategory  | ObjectId| required: true, ref: 'Category'    |
| createdAt   | Date    | default: Date.now                  |
| updatedAt   | Date    | default: Date.now                  |

#### **Brand Model**

| Field       | Type    | Constraints                        |
| ----------- | ------- | ---------------------------------- |
| name        | String  | required: true, unique: true, minLength: 2, maxLength: 50 |
| logo        | String  | required: true, match: /^(http|https):\/\/[^\s]+$/ |
| createdAt   | Date    | default: Date.now                  |
| updatedAt   | Date    | default: Date.now                  |

#### **Product Model**

| Field       | Type    | Constraints                        |
| ----------- | ------- | ---------------------------------- |
| name        | String  | required: true, minLength: 2, maxLength: 100 |
| description | String  | required: true, minLength: 10      |
| price       | Number  | required: true, min: 0             |
| discount    | Number  | min: 0, max: 100                   |
| categoryId  | ObjectId| required: true, ref: 'Category'    |
| subCategoryId | ObjectId| ref: 'SubCategory'               |
| brandId     | ObjectId| required: true, ref: 'Brand'       |
| images      | [String]| required: true, match: /^(http|https):\/\/[^\s]+$/ |
| coverImage  | String  | required: true, match: /^(http|https):\/\/[^\s]+$/ |
| stock       | Number  | required: true, min: 0             |
| sold        | Number  | default: 0, min: 0                 |
| ratings     | Number  | default: 0, min: 0, max: 5         |
| numRatings  | Number  | default: 0, min: 0                 |
| slug        | String  | required: true, unique: true       |
| createdAt   | Date    | default: Date.now                  |
| updatedAt   | Date    | default: Date.now                  |

#### **Review Model**

| Field       | Type    | Constraints                        |
| ----------- | ------- | ---------------------------------- |
| userId      | ObjectId| required: true, ref: 'User'        |
| productId   | ObjectId| required: true, ref: 'Product'     |
| rating      | Number  | required: true, min: 1, max: 5     |
| comment     | String  |                                    |
| createdAt   | Date    | default: Date.now                  |
| updatedAt   | Date    | default: Date.now                  |

#### **Cart Model**

| Field       | Type    | Constraints                        |
| ----------- | ------- | ---------------------------------- |
| userId      | ObjectId| required: true, ref: 'User'        |
| products    | [{ productId: ObjectId, quantity: Number }] | required: true, productId required, ref: 'Product', quantity: { type: Number, min: 1 } |
| createdAt   | Date    | default: Date.now                  |
| updatedAt   | Date    | default: Date.now                  |

#### **Coupon Model**

| Field       | Type    | Constraints                        |
| ----------- | ------- | ---------------------------------- |
| code        | String  | required: true, unique: true       |
| discount    | Number  | required: true, min: 0, max: 100   |
| expiryDate  | Date    |                                    |
| usageCount  | Number  |                                    |
| createdAt   | Date    | default: Date.now                  |
| updatedAt   | Date    | default: Date.now                  |

#### **Order Model**

| Field       | Type    | Constraints                        |
| ----------- | ------- | ---------------------------------- |
| userId      | ObjectId| required: true, ref: 'User'        |
| products    | [{ productId: ObjectId, quantity: Number }] | required: true, productId required, ref: 'Product', quantity: { type: Number, min: 1 } |
| total_price | Number  | required: true, min: 0             |
| status      | String  | required: true, default: 'pending', enum: ['pending', 'shipped', 'delivered', 'cancelled'] |
| createdAt   | Date    | default: Date.now                  |
| updatedAt   | Date    | default: Date.now                  |

---

## API Documentation

For detailed API documentation, please refer to my [Postman Documentation](https://documenter.getpostman.com/view/34627138/2sA3kPqkBh).

---
