// Mock data for payments (replace with dynamic data from your database)
const payments = [
    {
        payment_id: 1,
        order_id: 192541,
        user_id: 1,
        payment_method: "Credit Card",
        payment_status: "Completed",
        payment_date: "2023-11-20",
    },
    {
        payment_id: 2,
        order_id: 192540,
        user_id: 2,
        payment_method: "PayPal",
        payment_status: "Pending",
        payment_date: "2023-12-01",
    },
];

// Function to load the payment data into the table
function loadPaymentTableData() {
    console.log('Loading payment table data...');
    
    const tableBody = document.getElementById("payment-table-body");

    // Check if the table body exists, if not, create a new table
    if (!tableBody) {
      // Create the table element
      const newTable = document.createElement("table");
      newTable.innerHTML = `
        <thead>
          <tr>
            <th>#</th>
            <th><input type="checkbox" id="select-all" onclick="selectAllPayments(this)"></th>
            <th>Payment ID</th>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Payment Method</th>
            <th>Payment Status</th>
            <th>Payment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="payment-table-body">
          <!-- Table rows will be populated here -->
        </tbody>
      `;
  
      // Append the new table to the document
      const mainContent = document.querySelector('.main-content');
      mainContent.appendChild(newTable);
    }
    
    // Proceed with adding data to the table body
    const updatedTableBody = document.getElementById("payment-table-body");
    updatedTableBody.innerHTML = ""; // Clear any existing rows
    
    payments.forEach((payment, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td><input type="checkbox" class="row-checkbox"></td>
        <td>${payment.payment_id}</td>
        <td>${payment.order_id}</td>
        <td>${payment.user_id}</td>
        <td>${payment.payment_method}</td>
        <td>${payment.payment_status}</td>
        <td>${payment.payment_date}</td>
        <td><button class="delete-btn" onclick="deletePayment(${payment.payment_id})">Delete</button></td>
      `;
      updatedTableBody.appendChild(row);
    });
}

// Function to delete a payment record
function deletePayment(paymentId) {
    const confirmDelete = confirm("Are you sure you want to delete this payment?");
    if (confirmDelete) {
        const paymentIndex = payments.findIndex((payment) => payment.payment_id === paymentId);
        if (paymentIndex !== -1) {
            payments.splice(paymentIndex, 1); // Remove the payment from the array
            loadPaymentTableData(); // Reload the payment data into the table
        }
    }
}

// Function to select/deselect all checkboxes
function selectAllPayments(checkbox) {
    const checkboxes = document.querySelectorAll(".row-checkbox");
    checkboxes.forEach((cb) => (cb.checked = checkbox.checked));
}

// Ensure that the table is populated once the page content is loaded
document.addEventListener("DOMContentLoaded", loadPaymentTableData);
