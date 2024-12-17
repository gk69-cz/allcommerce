

const users = [
    {
      user_id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      address: "123 Main St, Springfield",
      phone_number: "1234567890",
      role: "customer",
      created_at: "2023-11-20",
      updated_at: "2023-12-01",
    },
    {
      user_id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      address: "456 Elm St, Shelbyville",
      phone_number: "9876543210",
      role: "admin",
      created_at: "2023-10-10",
      updated_at: "2023-12-01",
    },
  ];
  
  // Function to load the table data
function loadTableData() {
console.log("tttttttt");
    const tableBody = document.getElementById("user-table-body");
    
    // Check if the table body exists, if not, create a new table
    if (!tableBody) {
      // Create the table element
      const newTable = document.createElement("table");
      newTable.innerHTML = `
        <thead>
          <tr>
            <th>#</th>
            <th><input type="checkbox" id="select-all" onclick="selectAll(this)"></th>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="user-table-body">
          <!-- Table rows will be populated here -->
        </tbody>
      `;
  
      // Append the new table to the document
      const mainContent = document.querySelector('.main-content');
      mainContent.appendChild(newTable);
    }
    
    // Proceed with adding data to the table body
    const updatedTableBody = document.getElementById("user-table-body");
    updatedTableBody.innerHTML = ""; // Clear any existing rows
    console.log("gggg")
    users.forEach((user, index) => {
        console.log(user)
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td><input type="checkbox" class="row-checkbox"></td>
        <td>${user.user_id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.address}</td>
        <td>${user.phone_number}</td>
        <td>${user.role}</td>
        <td>${user.created_at}</td>
        <td><button class="delete-btn" onclick="deleteUser(${user.user_id})">Delete</button></td>
      `;
      updatedTableBody.appendChild(row);
    });
  }
  
  
  function deleteUser(userId) {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      const userIndex = users.findIndex((user) => user.user_id === userId);
      if (userIndex !== -1) {
        users.splice(userIndex, 1); // Remove the user from the array
        loadTableData(); // Reload the table
      }
    }
  }
  
  function selectAll(checkbox) {
    const checkboxes = document.querySelectorAll(".row-checkbox");
    checkboxes.forEach((cb) => (cb.checked = checkbox.checked));
  }
  
  // Ensure that the table is populated once the page content is loaded

  

