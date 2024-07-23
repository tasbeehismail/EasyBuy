# EasyBuy

## Project Overview

The platform is designed to facilitate seamless online shopping experiences for users while providing efficient product management for administrators.

---

## Table of Contents
- [Requirements](#requirements)
- [Database Design](#database-design)
  - [Overview](#overview)
  - [Schema Diagram](#schema-diagram)
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

---

## API Documentation

For detailed API documentation, please refer to my [Postman Documentation](https://documenter.getpostman.com/view/34627138/2sA3kPqkBh).

---
