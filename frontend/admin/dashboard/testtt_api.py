import unittest
import pyodbc
import logging
import time

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class TestDatabaseConnection(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """Log the start of the test suite."""
        logger.debug("Starting test suite...")

    def setUp(self):
        """Set up the database connection before each test."""
        logger.debug("Setting up database connection...")

        start_time = time.time()
        conn_str = (
            "DRIVER={ODBC Driver 17 for SQL Server};"
            "SERVER=np:\\\\.\\pipe\\LOCALDB#F3337DCC\\tsql\\query;"  # Updated instance pipe name
            "DATABASE=Ecomm;"
            "Trusted_Connection=yes;Connection Timeout=30;"
        )
        try:
            self.conn = pyodbc.connect(conn_str)
            logger.debug("Database connection established.")
        except pyodbc.Error as e:
            self.fail(f"Failed to connect to the database: {e}")

        elapsed_time = time.time() - start_time
        logger.debug(f"Database connection setup took {elapsed_time:.2f} seconds.")

    def test_connection(self):
        """Test if the connection to the database is successful."""
        logger.debug("Testing database connection...")
        start_time = time.time()

        self.assertIsNotNone(self.conn, "Database connection should not be None.")
        
        elapsed_time = time.time() - start_time
        logger.debug(f"Connection test took {elapsed_time:.2f} seconds.")

    def test_users_table_exists(self):
        """Test if the Users table exists."""
        logger.debug("Testing if Users table exists...")
        start_time = time.time()

        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users'")
        result = cursor.fetchone()
        self.assertIsNotNone(result, "The Users table should exist in the database.")
        
        elapsed_time = time.time() - start_time
        logger.debug(f"Users table check took {elapsed_time:.2f} seconds.")

    def test_insert_and_select_users(self):
        """Test inserting and selecting a record from the Users table."""
        logger.debug("Testing insert and select on Users table...")
        start_time = time.time()

        cursor = self.conn.cursor()
        
        # Insert a test user (user_id is auto-incremented)
        cursor.execute(""" 
            INSERT INTO Users (name, email, password, address, phone_number, wishlist, role, created_at, updated_at)
VALUES (
    'test1in377', 
    'test1in377@example.com', 
    'hashed_password123', 
    '123 Elm Street, Springfield', 
    '1234567890', 
    '{}', 
    'customer', 
    GETDATE(), 
    GETDATE()
);

        """)
        self.conn.commit()
        
        # Select the inserted user
        cursor.execute("SELECT * FROM Users WHERE email = 'test1in377@example.com'")
        result = cursor.fetchone()
        
        # Assertions
        self.assertIsNotNone(result, "User was not found in the database.")
        self.assertEqual(result[1], 'test1in377', "Inserted username does not match.")
        self.assertEqual(result[2], 'test1in377@example.com', "Inserted email does not match.")
        self.assertEqual(result[6], '{}', "Inserted wishlist does not match.")
        self.assertEqual(result[7], 'customer', "Inserted role does not match.")
        
        elapsed_time = time.time() - start_time
        logger.debug(f"Users insert/select test took {elapsed_time:.2f} seconds.")

    def test_categories_table_exists(self):
        """Test if the Categories table exists."""
        logger.debug("Testing if Categories table exists...")
        start_time = time.time()

        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Categories'")
        result = cursor.fetchone()
        self.assertIsNotNone(result, "The Categories table should exist in the database.")
        
        elapsed_time = time.time() - start_time
        logger.debug(f"Categories table check took {elapsed_time:.2f} seconds.")

    def test_insert_and_select_categories(self):
        cursor = self.conn.cursor()

        # Insert a test category
        cursor.execute("""
            INSERT INTO Categories (category_name, category_icon, description)
            VALUES ('Electronics', 'https://th.bing.com/th/id/OIP.d8WM4VWYPHKx09WEcAD3eAHaE7?w=231&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', 'All electronic items')
        """)
        self.conn.commit()

        # Retrieve the inserted category
        cursor.execute("SELECT * FROM Categories WHERE category_name = 'Electronics'")
        result = cursor.fetchone()

        # Assertions
        self.assertIsNotNone(result, "The category 'Electronics' should exist in the database.")
        self.assertEqual(result[1], 'Electronics', "Inserted category name does not match.")
        self.assertEqual(result[2], 'https://th.bing.com/th/id/OIP.d8WM4VWYPHKx09WEcAD3eAHaE7?w=231&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', "Inserted category icon does not match.")
        self.assertEqual(result[3], 'All electronic items', "Inserted description does not match.")
      
    def test_products_table_exists(self):
        """Test if the Products table exists."""
        start_time = time.time()
        logger.debug("Testing if Products table exists...")
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Products'")
        result = cursor.fetchone()
        self.assertIsNotNone(result, "The Products table should exist in the database.")
        elapsed_time = time.time() - start_time
        logger.debug(f"Products table check took {elapsed_time:.2f} seconds.")
    
    def test_insert_and_select_products(self):
        cursor = self.conn.cursor()
        # Insert a test user
        cursor.execute("""
            INSERT INTO Users (name, email, password, address, phone_number, wishlist, role) 
            VALUES ('testuser', 'testuser@example.com', 'hashed_password', '123 Test St', '1234567890', '{}', 'customer')
        """)
        self.conn.commit()

        # Select the inserted user
        cursor.execute("SELECT * FROM Users WHERE email = 'testuser@example.com'")
        result = cursor.fetchone()

        # Assertions
        self.assertIsNotNone(result, "User was not found in the database.")
        self.assertEqual(result[1], 'testuser', "Inserted username does not match.")
        self.assertEqual(result[2], 'testuser@example.com', "Inserted email does not match.")
      
    def test_insert_and_select_products(self):
        start_time = time.time()
        logger.debug("Testing insert and select on Products table...")
        cursor = self.conn.cursor()

        # Insert a test product (product_id is auto-incremented)
        cursor.execute("""
            INSERT INTO Products (name, description, price, discounted_price, stock, category_id, image_url, rating, reviews_count, is_featured)
            VALUES ('Smartphone', 'Latest smartphone with great features', 599.99, 499.99, 100, 1, 'https://example.com/images/smartphone.jpg', 4.5, 50, 1)
        """)
        self.conn.commit()

        # Select the inserted product
        cursor.execute("SELECT * FROM Products WHERE name = 'Smartphone'")
        result = cursor.fetchone()

        # Assertions
        self.assertIsNotNone(result, "Product was not found in the database.")
        self.assertEqual(result[1], 'Smartphone', "Inserted product name does not match.")
        self.assertEqual(result[2], 'Latest smartphone with great features', "Inserted product description does not match.")
        self.assertEqual(result[3], 599.99, "Inserted product price does not match.")
        self.assertEqual(result[4], 499.99, "Inserted discounted price does not match.")
        self.assertEqual(result[5], 100, "Inserted stock does not match.")
        self.assertEqual(result[6], 1, "Inserted category_id does not match.")
        self.assertEqual(result[7], 'https://example.com/images/smartphone.jpg', "Inserted image URL does not match.")
        self.assertEqual(result[8], 4.5, "Inserted rating does not match.")
        self.assertEqual(result[9], 50, "Inserted review count does not match.")
        self.assertEqual(result[10], 1, "Inserted featured status does not match.")
        
        elapsed_time = time.time() - start_time
        logger.debug(f"Products insert/select test took {elapsed_time:.2f} seconds.")
         
    def test_insert_into_flash_sales(self):
        self.cursor.execute("""
           INSERT INTO FlashSales (product_id, discounted_price, start_time, end_time)
VALUES (17, 49.99, '2024-12-15 09:00:00', '2024-12-15 18:00:00');
        """)
        self.conn.commit()
        self.cursor.execute("SELECT TOP 1 product_id FROM Products ORDER BY product_id DESC")
        product_id = self.cursor.fetchone()[0]

        # Insert into FlashSales
        self.cursor.execute("""
            INSERT INTO FlashSales (product_id, discounted_price, start_time, end_time)
            VALUES (?, ?, GETDATE(), DATEADD(DAY, 1, GETDATE()))
        """, (product_id, 80.00))
        self.conn.commit()

        # Verify the data
        self.cursor.execute("SELECT * FROM FlashSales WHERE product_id = ?", (product_id,))
        result = self.cursor.fetchone()
        self.assertIsNotNone(result, "Data not inserted into FlashSales.")
        self.assertEqual(result[1], product_id, "Product ID mismatch.")
        self.assertEqual(result[2], 80.00, "Discounted price mismatch.")

    def tearDown(self):
        """Clean up the database connection and test data after each test."""
        logger.debug("Cleaning up test data...")
        if hasattr(self, 'conn') and self.conn:
            cursor = self.conn.cursor()

            # # Log before the cleanup
            # start_time = time.time()
            # # Clean up test data for Users table
            # cursor.execute("DELETE FROM Users WHERE email = 'testuser@example.com'")
            # # Clean up test data for Categories table
            # cursor.execute("DELETE FROM Categories WHERE category_name = 'TestinggCategory'")
            # self.conn.commit()
            # end_time = time.time()

            # logger.debug(f"Cleanup took {end_time - start_time:.4f} seconds.")
            cursor.close()
            self.conn.close()
            
    

    @classmethod
    def tearDownClass(cls):
        """Log the end of the test suite."""
        logger.debug("Test suite completed.")
        
        

if __name__ == "__main__":
    unittest.main()
