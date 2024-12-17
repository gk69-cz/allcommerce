
// Function to load users from the API
function loadUsers() {
    fetch('http://127.0.0.1:5000/api/get-users')
        .then(response => response.json())
        .then(data => {
            const users = data.users;
            const tableBody = document.getElementById('user-table-body');

            // Clear the table body before adding new rows
            tableBody.innerHTML = '';

            // Loop through each user and add a row to the table
            users.forEach((user, index) => {
                const row = document.createElement('tr');

                // Create table cells
                const cell1 = document.createElement('td');
                cell1.textContent = index + 1;

                const cell2 = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                cell2.appendChild(checkbox);

                const cell3 = document.createElement('td');
                cell3.textContent = user.user_id;

                const cell4 = document.createElement('td');
                cell4.textContent = user.name;

                const cell5 = document.createElement('td');
                cell5.textContent = user.email;

                

                const cell7 = document.createElement('td');
                cell7.textContent = user.phone_number;

                const cell8 = document.createElement('td');
                cell8.textContent = user.role;

               
                const cell10 = document.createElement('td');
                const actionsCell = document.createElement('td');
                actionsCell.innerHTML = `
                    <button onclick="deleteUser(${user.user_id})" style="border: none; background: none; cursor: pointer;">
                        <i class="fas fa-trash-alt" title="Delete" style="color: #dc3545; font-size: 1.2em;"></i>
                    </button>
                `;
                cell10.appendChild(actionsCell);

                // Append cells to the row
                row.appendChild(cell1);
                row.appendChild(cell2);
                row.appendChild(cell3);
                row.appendChild(cell4);
                row.appendChild(cell5);
                row.appendChild(cell7);
                row.appendChild(cell8);    
                row.appendChild(cell10);

                // Append row to the table body
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading users:', error);
        });
}

// Function to delete a user
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`http://127.0.0.1:5000/api/delete-user?user_id=${userId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('User deleted successfully');
                    loadUsers();  // Reload the table after deletion
                } else {
                    alert('Failed to delete the user');
                }
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    }
}

// Call the loadUsers function to populate the table when the page loads
window.onload = function () {
    loadUsers();
};