import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_db_connection, init_db
import os
from datetime import datetime
import pyodbc
from werkzeug.security import check_password_hash

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})# Enable CORS for all routes

# Initialize the database
init_db()

@app.route('/api/items', methods=['GET'])
def get_items():
    conn = get_db_connection()
    items = conn.execute('SELECT * FROM items').fetchall()
    conn.close()
    return jsonify([dict(item) for item in items])

# login  and signup

@app.route('/api/login', methods=['POST'])
def login():
    # Parse JSON data from the request
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    print(email)
    print(password)
    # Validate input
    if not all([email, password]):
        return jsonify({"message": "Email and password are required", "status": "error"}), 400

    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Check if the user exists and the password matches
        cursor.execute(''' 
            SELECT user_id, name, role FROM Users WHERE email = ? AND password = ?
        ''', (email, password))
        user = cursor.fetchone()

        if user:
            # If user exists, return success response with user details
            user_id, name, role = user
            return jsonify({
                "message": f"Welcome back, {name}!",
                "status": "success",
                "user": {
                    "id": user_id,
                    "name": name,
                    "role": role,
                    "email": email
                }
            }), 200
        else:
            
            return jsonify({"message": "Invalid email or password", "status": "error"}), 401
    except pyodbc.Error as e:
        print(f"Error during login query: {e}")
        return jsonify({"message": "An error occurred during login", "status": "error"}), 500
    finally:
        conn.close()
   
@app.route('/api/signup', methods=['POST'])
def signup_user():
    conn = get_db_connection()
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone_number = data.get('phone_number', '')
    role = data.get('role', 'customer')  # Default role is 'customer'

    # Check for missing fields
    if not all(key in data for key in ['name', 'email', 'password']):
        conn.close()
        return jsonify({'error': 'Missing required fields'}), 400

    # Validate required fields
    if not name.strip() or not email.strip() or not password.strip():
        conn.close()
        return jsonify({'error': 'Name, email, and password are required and cannot be empty'}), 400

    # Check if email already exists
    existing_user = conn.execute('SELECT * FROM Users WHERE email = ?', (email,)).fetchone()
    if existing_user:
        conn.close()
        return jsonify({'error': 'Email is already registered'}), 409

    # Insert the user into the database
    try:
        query = '''
            INSERT INTO Users (name, email, password, phone_number, role) 
            VALUES (?, ?, ?, ?, ?)
        '''
        # Print query and parameters for debugging
        print("Executing query:", query)
        print("With parameters:", (name, email, password, phone_number, role))
        
        conn.execute(query, (name, email, password, phone_number, role))
        conn.commit()
    except Exception as e:
        conn.close()
        print(f"Error during database operation: {e}")  # Debugging
        return jsonify({'error': 'An error occurred while creating the account', 'details': str(e)}), 500

    conn.close()
    return jsonify({'message': 'Signup successful'}), 201


@app.route('/api/add-category', methods=['POST'])
def add_category():
    # Parse JSON data from the request
    data = request.get_json()
    category_name = data.get('category_name')
    category_icon = data.get('category_icon', '')
    description = data.get('description', '')
    
    # Validate input
    if not category_name:
        return jsonify({"message": "Category name is required", "status": "error"}), 400

    # Get current datetime for created_at and updated_at
    current_timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Prepare the SQL query
        query = '''
            INSERT INTO Categories (category_name, category_icon, description, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        '''
        values = (category_name, category_icon, description, current_timestamp, current_timestamp)

        # Log the query and its parameters
        print("Executing query:")
        print(f"Query: {query}")
        print(f"Values: {values}")

        # Execute the query
        cursor.execute(query, values)

        # Commit the transaction
        conn.commit()

        # Return success response
        return jsonify({
            "message": f"Category '{category_name}' added successfully!",
            "status": "success"
        }), 201

    except pyodbc.Error as e:
        print(f"Error during add category query: {e}")
        return jsonify({"message": "An error occurred while adding the category", "status": "error"}), 500

    finally:
        conn.close()
# get category

@app.route('/api/category/<int:category_id>', methods=['GET'])
def get_category(category_id):
    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500
    

    try:
        cursor = conn.cursor()

        # Fetch category by category_id
        cursor.execute('''
            SELECT category_id, category_name, category_icon, description, created_at, updated_at
            FROM Categories
            WHERE category_id = ?
        ''', (category_id,))
        category = cursor.fetchone()

        if category:
            # If category exists, return the category details
            return jsonify({
                "message": "Category found",
                "status": "success",
                "category": {
                    "id": category[0],
                    "name": category[1],
                    "icon": category[2],
                    "description": category[3],
                    "created_at": category[4],
                    "updated_at": category[5]
                }
            }), 200
        else:
            # If category does not exist
            return jsonify({"message": "Category not found", "status": "error"}), 404

    except pyodbc.Error as e:
        print(f"Error during get category query: {e}")
        return jsonify({"message": "An error occurred while fetching the category", "status": "error"}), 500
    finally:
        conn.close()


@app.route('/api/category/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Delete the category by category_id
        cursor.execute('''
            DELETE FROM Categories
            WHERE category_id = ?
        ''', (category_id,))

        # Check if any rows were deleted
        if cursor.rowcount > 0:
            conn.commit()
            return jsonify({
                "message": f"Category with ID {category_id} deleted successfully!",
                "status": "success"
            }), 200
        else:
            return jsonify({"message": "Category not found", "status": "error"}), 404

    except pyodbc.Error as e:
        print(f"Error during delete category query: {e}")
        return jsonify({"message": "An error occurred while deleting the category", "status": "error"}), 500
    finally:
        conn.close()

@app.route('/api/get-all-categories', methods=['GET'])
def get_all_categories():
    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Execute the query to fetch all categories
        cursor.execute('SELECT category_id, category_name, category_icon, description, created_at, updated_at FROM Categories')
        categories = cursor.fetchall()

        # Check if any categories were found
        if categories:
            # Prepare a list of categories as dictionaries
            category_list = []
            for category in categories:
                category_list.append({
                    "category_id": category[0],
                    "category_name": category[1],
                    "category_icon": category[2],
                    "description": category[3],
                    "created_at": category[4],
                    "updated_at": category[5]
                })

            # Return success response with categories
            response = jsonify({
                "message": "Categories fetched successfully",
                "status": "success",
                "categories": category_list
            })
            response.status_code = 200
            response.headers['X-API-Status'] = 'Success'
            response.headers['Content-Type'] = 'application/json'
            return response

        else:
            # If no categories are found
            response = jsonify({"message": "No categories found", "status": "error"})
            response.status_code = 404
            response.headers['X-API-Status'] = 'Error'
            response.headers['Content-Type'] = 'application/json'
            return response

    except pyodbc.Error as e:
        print(f"Error during get all categories query: {e}")
        response = jsonify({"message": "An error occurred while fetching categories", "status": "error"})
        response.status_code = 500
        response.headers['X-API-Status'] = 'Error'
        response.headers['Content-Type'] = 'application/json'
        return response

    finally:
        conn.close()


# product 
@app.route('/api/product/<int:product_id>', methods=['GET'])
def get_product(product_id):
    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Fetch product by product_id
        cursor.execute('''
            SELECT product_id, name, description, price, discounted_price, stock, image_url, rating, reviews_count, is_featured
            FROM Products
            WHERE product_id = ?
        ''', (product_id,))
        product = cursor.fetchone()

        if product:
            return jsonify({
                "message": "Product found",
                "status": "success",
                "product": {
                    "id": product[0],
                    "name": product[1],
                    "description": product[2],
                    "price": product[3],
                    "discounted_price": product[4],
                    "stock": product[5],
                    "image_url": product[6],
                    "rating": product[7],
                    "reviews_count": product[8],
                    "is_featured": product[9]
                }
            }), 200
        else:
            return jsonify({"message": "Product not found", "status": "error"}), 404

    except pyodbc.Error as e:
        print(f"Error during get product query: {e}")
        return jsonify({"message": "An error occurred while fetching the product", "status": "error"}), 500
    finally:
        conn.close()




@app.route('/api/add-product', methods=['POST'])
def add_product():
    # Parse JSON data from the request
    data = request.get_json()
    
    # Extract product fields from the request data
    product_name = data.get('name')
    description = data.get('description', '')
    price = data.get('price')
    discounted_price = data.get('discounted_price', None)
    stock = data.get('stock')
    category_id = data.get('category_id')
    image_url = data.get('image_url', '')
    is_featured = data.get('is_featured', False)

    # Validate input
    if not product_name:
        return jsonify({"message": "Product name is required", "status": "error"}), 400
    if not price or not isinstance(price, (int, float)):
        return jsonify({"message": "Valid price is required", "status": "error"}), 400
    if not stock or not isinstance(stock, int):
        return jsonify({"message": "Valid stock quantity is required", "status": "error"}), 400
    if not category_id:
        return jsonify({"message": "Category ID is required", "status": "error"}), 400

    # Get current datetime for created_at and updated_at
    current_timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Prepare the SQL query to insert the new product
        query = '''
            INSERT INTO Products (name, description, price, discounted_price, stock, category_id, image_url, is_featured, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        '''
        values = (product_name, description, price, discounted_price, stock, category_id, image_url, is_featured, current_timestamp, current_timestamp)

        # Log the query and its parameters for debugging
        print("Executing query:")
        print(f"Query: {query}")
        print(f"Values: {values}")

        # Execute the query
        cursor.execute(query, values)

        # Commit the transaction
        conn.commit()

        # Return success response
        return jsonify({
            "message": f"Product '{product_name}' added successfully!",
            "status": "success"
        }), 201

    except pyodbc.Error as e:
        print(f"Error during add product query: {e}")
        return jsonify({"message": "An error occurred while adding the product", "status": "error"}), 500

    finally:
        conn.close()


@app.route('/api/products/category/<int:category_id>', methods=['GET'])
def get_products_by_category(category_id):
    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Fetch products by category_id
        cursor.execute('''
            SELECT p.product_id, p.name, p.description, p.price, p.discounted_price, 
                   p.stock, p.image_url, p.rating, p.reviews_count, p.is_featured
            FROM Products p
            WHERE p.category_id = ?
        ''', (category_id,))
        products = cursor.fetchall()

        if products:
            product_list = []
            for product in products:
                product_list.append({
                    "id": product[0],
                    "name": product[1],
                    "description": product[2],
                    "price": product[3],
                    "discounted_price": product[4],
                    "stock": product[5],
                    "image_url": product[6],
                    "rating": product[7],
                    "reviews_count": product[8],
                    "is_featured": product[9]
                })
            return jsonify({
                "message": "Products fetched successfully",
                "status": "success",
                "products": product_list
            }), 200
        else:
            return jsonify({"message": "No products found for this category", "status": "error"}), 404

    except pyodbc.Error as e:
        print(f"Error during get products query: {e}")
        return jsonify({"message": "An error occurred while fetching products", "status": "error"}), 500
    finally:
        conn.close()



@app.route('/api/products', methods=['GET'])
def get_products():
    # Extract optional query parameters from the URL
    product_id = request.args.get('product_id', type=int)
    category_id = request.args.get('category_id', type=int)
    is_featured = request.args.get('is_featured', type=int)  # 0 or 1, filter for featured products

    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Base query to get all products
        query = 'SELECT * FROM Products WHERE 1=1'
        params = []

        # Add filters based on the query parameters
        if product_id:
            query += ' AND product_id = ?'
            params.append(product_id)
        if category_id:
            query += ' AND category_id = ?'
            params.append(category_id)
        if is_featured is not None:
            query += ' AND is_featured = ?'
            params.append(is_featured)

        # Execute the query with the parameters
        cursor.execute(query, params)

        # Fetch all results
        products = cursor.fetchall()

        # If no products found, return a message
        if not products:
            return jsonify({"message": "No products found", "status": "info"}), 404

        # Prepare the products data for the response
        products_list = []
        for product in products:
            products_list.append({
                "product_id": product[0],
                "name": product[1],
                "description": product[2],
                "price": product[3],
                "discounted_price": product[4],
                "stock": product[5],
                "category_id": product[6],
                "image_url": product[7],
                "rating": product[8],
                "reviews_count": product[9],
                "is_featured": product[10],
                "created_at": product[11].strftime('%Y-%m-%d %H:%M:%S'),
                "updated_at": product[12].strftime('%Y-%m-%d %H:%M:%S')
            })

        # Return the products data as a JSON response
        return jsonify({
            "products": products_list,
            "status": "success"
        }), 200

    except pyodbc.Error as e:
        print(f"Error during get products query: {e}")
        return jsonify({"message": "An error occurred while fetching products", "status": "error"}), 500

    finally:
        conn.close()

@app.route('/api/edit-products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    # Extract the JSON data from the request
    data = request.get_json()

    # Fields that can be updated
    fields = ["name", "description", "price", "discounted_price", "stock", 
              "category_id", "image_url", "rating", "reviews_count", "is_featured"]

    # Build the update query dynamically based on the provided fields
    updates = []
    params = []

    for field in fields:
        if field in data:
            updates.append(f"{field} = ?")
            params.append(data[field])

    if not updates:
        return jsonify({"message": "No valid fields provided for update", "status": "error"}), 400

    # Add the product_id to the parameters
    params.append(product_id)

    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Update query
        query = f"UPDATE Products SET {', '.join(updates)} WHERE product_id = ?"
        cursor.execute(query, params)

        # Commit changes
        conn.commit()

        # Check if any row was updated
        if cursor.rowcount == 0:
            return jsonify({"message": "Product not found or no changes made", "status": "info"}), 404

        return jsonify({"message": "Product updated successfully", "status": "success"}), 200

    except pyodbc.Error as e:
        print(f"Error during update product query: {e}")
        return jsonify({"message": "An error occurred while updating the product", "status": "error"}), 500

    finally:
        conn.close()

@app.route('/api/edit-user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    # Extract the JSON data from the request
    data = request.get_json()

    # Fields that can be updated
    fields = ["name", "description", "price", "discounted_price", "stock", 
              "category_id", "image_url", "rating", "reviews_count", "is_featured"]

    # Build the update query dynamically based on the provided fields
    updates = []
    params = []

    for field in fields:
        if field in data:
            updates.append(f"{field} = ?")
            params.append(data[field])

    if not updates:
        return jsonify({"message": "No valid fields provided for update", "status": "error"}), 400

    # Add the product_id to the parameters
    params.append(user_id)

    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Update query
        query = f"UPDATE User SET {', '.join(updates)} WHERE user_id = ?"
        cursor.execute(query, params)

        # Commit changes
        conn.commit()

        # Check if any row was updated
        if cursor.rowcount == 0:
            return jsonify({"message": "user not found or no changes made", "status": "info"}), 404

        return jsonify({"message": "user updated successfully", "status": "success"}), 200

    except pyodbc.Error as e:
        print(f"Error during update product query: {e}")
        return jsonify({"message": "An error occurred while updating the user", "status": "error"}), 500

    finally:
        conn.close()

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Query to get the product by ID
        query = 'SELECT * FROM Products WHERE product_id = ?'
        cursor.execute(query, (product_id,))

        # Fetch the product
        product = cursor.fetchone()

        # If no product found, return a message
        if not product:
            return jsonify({"message": "Product not found", "status": "info"}), 404

        # Prepare the product data for the response
        product_data = {
            "product_id": product[0],
            "name": product[1],
            "description": product[2],
            "price": product[3],
            "discounted_price": product[4],
            "stock": product[5],
            "category_id": product[6],
            "image_url": product[7],
            "rating": product[8],
            "reviews_count": product[9],
            "is_featured": product[10],
            "created_at": product[11].strftime('%Y-%m-%d %H:%M:%S'),
            "updated_at": product[12].strftime('%Y-%m-%d %H:%M:%S')
        }

        # Return the product data as a JSON response
        return jsonify({
            "product": product_data,
            "status": "success"
        }), 200

    except pyodbc.Error as e:
        print(f"Error during get product by ID query: {e}")
        return jsonify({"message": "An error occurred while fetching the product", "status": "error"}), 500

    finally:
        conn.close()

@app.route('/api/orders', methods=['GET'])
def get_orders():
   

    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Base query to get all orders with product details
        query = '''
            SELECT 
                Cart.cart_id,
                Cart.user_id,
                Cart.product_id,
                Cart.quantity,
                Products.name AS product_name,
                Products.description AS product_description,
                Products.price,
                Products.discounted_price,
                Products.stock,
                Products.image_url
            FROM Cart
            JOIN Products ON Cart.product_id = Products.product_id
            WHERE 1=1
        '''
        params = []

        # Add filter for user_id if provided
        

        # Execute the query with parameters
        cursor.execute(query, params)

        # Fetch all results
        orders = cursor.fetchall()

        # If no orders found, return a message
        if not orders:
            return jsonify({"message": "No orders found", "status": "info"}), 404

        # Prepare the orders data for the response
        orders_list = []
        for order in orders:
            orders_list.append({
                "cart_id": order[0],
                "user_id": order[1],
                "product_id": order[2],
                "quantity": order[3],
                "product_details": {
                    "name": order[4],
                    "description": order[5],
                    "price": float(order[6]),
                    "discounted_price": float(order[7]) if order[7] else None,
                    "stock": order[8],
                    "image_url": order[9]
                }
            })

        # Return the orders data as a JSON response
        return jsonify({
            "orders": orders_list,
            "status": "success"
        }), 200

    except pyodbc.Error as e:
        print(f"Error during get orders query: {e}")
        return jsonify({"message": "An error occurred while fetching orders", "status": "error"}), 500

    finally:
        conn.close()

@app.route('/api/products/sort-by-price', methods=['GET'])
def get_products_sorted_by_price():
    # Extract optional query parameters for sorting direction
    order = request.args.get('order', default='asc', type=str)  # 'asc' or 'desc'

    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Base query to get all products sorted by discounted_price, casting it to float for numerical sorting
        query = '''
            SELECT * FROM Products 
            ORDER BY CAST(discounted_price AS FLOAT) ''' + (order.upper() if order in ['asc', 'desc'] else 'asc')
        
        # Execute the query
        cursor.execute(query)

        # Fetch all results
        products = cursor.fetchall()

        # If no products found, return a message
        if not products:
            return jsonify({"message": "No products found", "status": "info"}), 404

        # Prepare the products data for the response
        products_list = []
        for product in products:
            products_list.append({
                "product_id": product[0],
                "name": product[1],
                "description": product[2],
                "price": product[3],
                "discounted_price": product[4],
                "stock": product[5],
                "category_id": product[6],
                "image_url": product[7],
                "rating": product[8],
                "reviews_count": product[9],
                "is_featured": product[10],
                "created_at": product[11].strftime('%Y-%m-%d %H:%M:%S'),
                "updated_at": product[12].strftime('%Y-%m-%d %H:%M:%S')
            })

        # Return the products data as a JSON response
        return jsonify({
            "products": products_list,
            "status": "success"
        }), 200

    except pyodbc.Error as e:
        print(f"Error during get products query: {e}")
        return jsonify({"message": "An error occurred while fetching products", "status": "error"}), 500

    finally:
        conn.close()

@app.route('/api/product/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Prepare the SQL query to delete the product by ID
        query = 'DELETE FROM Products WHERE product_id = ?'
        
        # Execute the query with the product_id as a parameter
        cursor.execute(query, (product_id,))
        
        # Commit the transaction
        conn.commit()

        # Check if any row was deleted
        if cursor.rowcount == 0:
            return jsonify({"message": f"Product with ID {product_id} not found", "status": "error"}), 404

        # Return success response
        return jsonify({
            "message": f"Product with ID {product_id} deleted successfully!",
            "status": "success"
        }), 200

    except pyodbc.Error as e:
        print(f"Error during delete product query: {e}")
        return jsonify({"message": "An error occurred while deleting the product", "status": "error"}), 500

    finally:
        conn.close()

@app.route('/api/products/sort-by-stock', methods=['GET'])
def get_products_sorted_by_stock():
    # Extract optional query parameters for sorting direction
    order = request.args.get('order', default='asc', type=str)  # 'asc' or 'desc'

    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Base query to get all products sorted by stock
        query = 'SELECT * FROM Products ORDER BY stock ' + (order.upper() if order in ['asc', 'desc'] else 'asc')
        
        # Execute the query
        cursor.execute(query)

        # Fetch all results
        products = cursor.fetchall()

        # If no products found, return a message
        if not products:
            return jsonify({"message": "No products found", "status": "info"}), 404

        # Prepare the products data for the response
        products_list = []
        for product in products:
            products_list.append({
                "product_id": product[0],
                "name": product[1],
                "description": product[2],
                "price": product[3],
                "discounted_price": product[4],
                "stock": product[5],
                "category_id": product[6],
                "image_url": product[7],
                "rating": product[8],
                "reviews_count": product[9],
                "is_featured": product[10],
                "created_at": product[11].strftime('%Y-%m-%d %H:%M:%S'),
                "updated_at": product[12].strftime('%Y-%m-%d %H:%M:%S')
            })

        # Return the products data as a JSON response
        return jsonify({
            "products": products_list,
            "status": "success"
        }), 200

    except pyodbc.Error as e:
        print(f"Error during get products query: {e}")
        return jsonify({"message": "An error occurred while fetching products", "status": "error"}), 500

    finally:
        conn.close()


@app.route('/api/get-users', methods=['GET'])
def get_users():
  
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Base query to get all users
        query = 'SELECT * FROM Users'
        params = []

        # Add filter based on the user_id if provided
       

        # Execute the query with the parameters
        cursor.execute(query, params)

        # Fetch all results
        users = cursor.fetchall()

        # If no users found, return a message
        if not users:
            return jsonify({"message": "No users found", "status": "info"}), 404

        # Prepare the users data for the response
        users_list = []
        for user in users:
            users_list.append({
                "user_id": user[0],
                "name": user[1],
                "email": user[2],
                "address": user[3],
                "phone_number": user[5],
                "wishlist": user[5],
                "role": user[7],
              
            })

        # Return the users data as a JSON response
        return jsonify({
            "users": users_list,
            "status": "success"
        }), 200

    except pyodbc.Error as e:
        print(f"Error during get users query: {e}")
        return jsonify({"message": "An error occurred while fetching users", "status": "error"}), 500

    finally:
        conn.close()

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Optimized query to fetch user details for the specific user_id
        cursor.execute('''
            SELECT user_id, name, email, phone_number, address, created_at, updated_at
            FROM Users
            WHERE user_id = ?
        ''', (user_id,))

        # Fetch the user data
        user = cursor.fetchone()

        if user:
            # Prepare the user data for the response
            user_data = {
                "user_id": user[0],
                "name": user[1],
                "email": user[2],
                "phone_number": user[3],
                "address": user[4],
                "created_at": user[5],
                "updated_at": user[6]
            }

            return jsonify({
                "message": "User fetched successfully",
                "status": "success",
                "user": user_data
            }), 200
        else:
            # If no user is found
            return jsonify({"message": "User not found", "status": "info"}), 404

    except pyodbc.Error as e:
        print(f"Error fetching user by ID: {e}")
        return jsonify({"message": "An error occurred while fetching the user", "status": "error"}), 500

    finally:
        conn.close()

@app.route('/api/delete-user', methods=['DELETE'])
def delete_user():
    # Extract user_id from the URL path parameter
    user_id = request.args.get('user_id', type=int)
    
    if not user_id:
        return jsonify({"message": "User ID is required", "status": "error"}), 400

    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500

    try:
        cursor = conn.cursor()

        # Query to delete the user by user_id
        cursor.execute("DELETE FROM Users WHERE user_id = ?", user_id)
        conn.commit()

        # Check if the user was deleted
        if cursor.rowcount > 0:
            return jsonify({'status': 'success', 'message': 'User deleted successfully'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

    except pyodbc.Error as e:
        print(f"Error during delete user query: {e}")
        return jsonify({"message": "An error occurred while deleting the user", "status": "error"}), 500

    finally:
        conn.close()

# cart adding 
@app.route('/api/cart', methods=['POST'])
def add_to_cart():
    # Get data from the request
    user_id = request.json.get('user_id')
    product_id = request.json.get('product_id')
    quantity = request.json.get('quantity')

    # Check if all required data is provided
    if not user_id or not product_id or not quantity:
        return jsonify({"message": "Missing required fields", "status": "error"}), 400
    
    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500
    
    try:
        cursor = conn.cursor()

        # Insert data into the Cart table
        cursor.execute('''
            INSERT INTO Cart (user_id, product_id, quantity)
            VALUES (?, ?, ?)
        ''', (user_id, product_id, quantity))

        # Commit the transaction
        conn.commit()

        return jsonify({
            "message": "Product added to cart successfully",
            "status": "success"
        }), 201

    except pyodbc.Error as e:
        print(f"Error during insert query: {e}")
        return jsonify({"message": "An error occurred while adding to the cart", "status": "error"}), 500

    finally:
        conn.close()


@app.route('/api/cart/<int:user_id>', methods=['GET'])
def get_cart_items(user_id):
    # Establish a database connection
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed", "status": "error"}), 500
    
    try:
        cursor = conn.cursor()

        # Optimized query to fetch all cart items for the specific user_id
        cursor.execute('''
            SELECT p.product_id, p.name, p.price, c.quantity
            FROM Cart c
            JOIN Products p ON c.product_id = p.product_id
            WHERE c.user_id = ?
        ''', (user_id,))

        # Fetch all items from the query result
        cart_items = cursor.fetchall()

        if cart_items:
            # Format the data to return as a JSON response
            cart_list = []
            for item in cart_items:
                subtotal = item[2] * item[3]  # Calculating subtotal directly in the code, not SQL
                cart_list.append({
                    "product_id": item[0],
                    "name": item[1],
                    "price": item[2],
                    "quantity": item[3],
                    "subtotal": subtotal
                })
            
            return jsonify({
                "message": "Cart items fetched successfully",
                "status": "success",
                "cart_items": cart_list
            }), 200
        else:
            # If no cart items are found
            return jsonify({"message": "No items found in cart", "status": "error"}), 404
    
    except pyodbc.Error as e:
        print(f"Error fetching cart items: {e}")
        return jsonify({"message": "An error occurred while fetching cart items", "status": "error"}), 500
    finally:
        conn.close()



print('hi')
print(app.url_map)
print('hi')
if __name__ == '__main__':
    app.run(debug=True)
