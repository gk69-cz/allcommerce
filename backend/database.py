import pyodbc

# Connection details for SQL Server

conn_str = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=np:\\\\.\\pipe\\LOCALDB#2FF04E36\\tsql\\query;"  # Updated instance pipe name
    "DATABASE=Ecomm;"
    "Trusted_Connection=yes;"
    "ApplicationIntent=ReadWrite;"
    "ODBCTracing=1;"
    "Timeout=50;"
)


print(conn_str);

# sqllocaldb info ProjectModels

def get_db_connection():
    try:
        # Connect to the database
        conn = pyodbc.connect(conn_str)
        print("Connection successful")
        return conn
    except pyodbc.Error as e:
        print("Error while connecting to SQL Server:")
        for err in e.args:
            print(err)
        return None

def init_db():
    conn = get_db_connection()
    if conn:
        try:
            # Create a cursor object
           
            print("connection successfully.")
        except pyodbc.Error as e:
            print(f"Error while initializing the database:")
            for err in e.args:
                print(err)
        finally:
            conn.close()
    else:
        print("Failed to connect to the database.")

# Initialize the database
init_db()


