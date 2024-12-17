Here is the **README.md** file with all the API endpoints included, formatted and ready for upload:

---

# ALLCOMMS E-Commerce Application

## Table of Contents
1. [Overview](#overview)  
2. [Features](#features)  
3. [Technologies Used](#technologies-used)  
4. [System Requirements](#system-requirements)  
5. [Setup and Installation](#setup-and-installation)  
6. [API Endpoints](#api-endpoints)  
7. [Database Schema](#database-schema)  
8. [Testing](#testing)  
9. [Future Enhancements](#future-enhancements)  
10. [Conclusion](#conclusion)

---

## Overview
**ALLCOMMS** is an e-commerce platform designed to simplify product and order management for small-to-medium businesses. The platform features a user-friendly interface, robust product management, and secure shopping functionalities.

---

## Features

### User Features
- **Authentication**: Secure signup and login.  
- **Product Management**: View products, search, and filter.  
- **Shopping Cart**: Add, remove, and update cart items.  
- **Order Management**: Place orders, checkout, and track statuses.  
- **Notifications**: Receive updates about orders and other activities.  

### Admin Features
- **Product Management**: Add, update, and delete products.  
- **Category Management**: Create, view, and delete categories.  
- **User Management**: View, update, and delete users.  
- **Order Management**: Manage and update order statuses.

---

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Python (Flask)  
- **Database**: SQL Server  

---

## System Requirements

### Hardware  
- **Processor**: Intel Octa Core or higher  
- **RAM**: 8GB or higher  
- **Storage**: 500GB HDD/SSD  

### Software  
- **Operating System**: Windows/Linux  
- **Tools**: Python, Flask, SQL Server  
- **Browser**: Chrome/Firefox  

---

## Setup and Installation
1. **Clone the Repository**  
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install Dependencies**  
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure the Database**  
   Update database connection details in `config.py`.

4. **Run the Application**  
   ```bash
   python app.py
   ```

5. **Access the Application**  
   Navigate to `http://127.0.0.1:5000` in your browser.

---

## API Endpoints

### Authentication APIs
| **Endpoint**                     | **Method** | **Functionality**                      |
|----------------------------------|------------|---------------------------------------|
| `/api/signup`                    | POST       | User registration                      |
| `/api/login`                     | POST       | User login and authentication          |

### User Management APIs
| **Endpoint**                     | **Method** | **Functionality**                      |
|----------------------------------|------------|---------------------------------------|
| `/api/get-users`                 | GET        | Retrieve all users                     |
| `/api/get_user/<int:user_id>`    | GET        | Retrieve details of a specific user    |
| `/api/edit-user/<int:user_id>`   | PUT        | Update user details                    |
| `/api/delete-user`               | DELETE     | Delete a specific user                 |

### Product Management APIs
| **Endpoint**                     | **Method** | **Functionality**                      |
|----------------------------------|------------|---------------------------------------|
| `/api/add-product`               | POST       | Add a new product                      |
| `/api/product/<int:product_id>`  | GET        | Retrieve a product by ID               |
| `/api/products`                  | GET        | Retrieve all products                  |
| `/api/products/category/<id>`    | GET        | Retrieve products under a category     |
| `/api/edit-products/<id>`        | PUT        | Update a specific product              |
| `/api/product/<int:product_id>`  | DELETE     | Delete a specific product              |
| `/api/products/sort-by-price`    | GET        | Retrieve products sorted by price      |
| `/api/products/sort-by-stock`    | GET        | Retrieve products sorted by stock      |

### Category Management APIs
| **Endpoint**                     | **Method** | **Functionality**                      |
|----------------------------------|------------|---------------------------------------|
| `/api/add-category`              | POST       | Add a new category                     |
| `/api/category/<int:category_id>`| GET        | Retrieve a specific category by ID     |
| `/api/category/<int:category_id>`| DELETE     | Delete a specific category             |
| `/api/get-all-categories`        | GET        | Retrieve all categories                |

### Cart Management APIs
| **Endpoint**                     | **Method** | **Functionality**                      |
|----------------------------------|------------|---------------------------------------|
| `/api/cart`                      | POST       | Add product to the cart                |
| `/api/cart/<int:user_id>`        | GET        | Retrieve cart items for a specific user|

### Order Management APIs
| **Endpoint**                     | **Method** | **Functionality**                      |
|----------------------------------|------------|---------------------------------------|
| `/api/orders`                    | GET        | Retrieve all orders                    |

---

## Database Schema
The following tables are included in the database:  
- Users  
- Categories  
- Products  
- Cart  
- Orders and OrderItems  
- Reviews  
- Notifications  
- Payment and Shipping  

## Testing
- **Unit Tests**: Verify database connections, table existence, and CRUD operations.  
- **Manual Tests**: Test product listings, user authentication, cart, and order management.

---

## Future Enhancements
1. **Dynamic Multi-Shop Hosting**: Enable vendors to create and manage independent shops.  
2. **AI Recommendations**: Implement AI-driven product recommendations.  
3. **Analytics**: Provide advanced reporting for sales and revenue.  
4. **Payment Integration**: Add a secure payment gateway.  

---

## Conclusion
The **ALLCOMMS E-Commerce Application** is a fully functional and scalable platform that simplifies online shopping and product management for small-to-medium-sized businesses. It offers a robust API structure, user-friendly UI, and a secure backend architecture.

---
