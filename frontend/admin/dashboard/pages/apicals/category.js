
window.onload = function() {
    // Call the API to get all categories
    fetch('http://127.0.0.1:5000/api/get-all-categories', {
        method: 'GET', // GET request to fetch data
        headers: {
            'Content-Type': 'application/json', // Content-Type header
            // Add other headers if needed (like Authorization)
        }
    })
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        // Handle the response data and populate the table
        if (data.status === "success") {
            populateCategoryTable(data.categories);
        } else {
            console.error("Failed to fetch categories:", data.message);
        }
    })
    .catch(error => {
        // Handle any errors
        console.error("Error fetching categories:", error);
    });
};

// Function to populate categories in the table
function populateCategoryTable(categories) {
    const categoryTableBody = document.getElementById('category-table-body');
    categoryTableBody.innerHTML = ''; // Clear the table first

    categories.forEach(category => {
        const row = document.createElement('tr');
        
        // Create table cells based on the headers
        const categoryIdCell = document.createElement('td');
        categoryIdCell.textContent = category.category_id;
        
        const selectCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('row-checkbox');
        selectCell.appendChild(checkbox);
        
        const nameCell = document.createElement('td');
        nameCell.textContent = category.category_name;
        
        const iconCell = document.createElement('td');
        const iconImage = document.createElement('img');
        iconImage.src = category.category_icon;
        iconImage.alt = category.category_name + " Icon";
        iconImage.style.width = '50px';
        iconCell.appendChild(iconImage);

        const nameCell2 = document.createElement('td');
        nameCell2.textContent = category.category_name;
        
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = category.description;
        
        const actionsCell = document.createElement('td');
        actionsCell.innerHTML = `
            <button onclick="editCategory(${category.category_id})" style="border: none; background: none; cursor: pointer;">
                <i class="fas fa-edit" title="Edit" style="color: #007bff; font-size: 1.2em;"></i>
            </button>
            <button onclick="deleteCategory(${category.category_id})" style="border: none; background: none; cursor: pointer;">
                <i class="fas fa-trash-alt" title="Delete" style="color: #dc3545; font-size: 1.2em;"></i>
            </button>
        `;
        
        // Append cells to the row
        row.appendChild(categoryIdCell);
        row.appendChild(selectCell);   // Select checkbox column
        
        row.appendChild(iconCell);  // Category ID
        row.appendChild(nameCell);  // Category Name
          // Category Icon
        row.appendChild(descriptionCell);  // Description
        row.appendChild(actionsCell);  // Actions (Edit/Delete buttons)
        
        // Append the row to the table body
        categoryTableBody.appendChild(row);
    });
    
}

// Example editCategory and deleteCategory functions (You can implement them based on your needs)
function editCategory(categoryId) {
    console.log("Editing category with ID:", categoryId);
    // Implement your edit logic here
}

function deleteCategory(categoryId) {
    // Confirm with the user before deleting
    if (confirm('Are you sure you want to delete this category?')) {
        // Make the DELETE request to the API
        
        fetch(`http://127.0.0.1:5000/api/category/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())  // Parse the response as JSON
        .then(data => {
            // Check if deletion was successful
            if (data.status === 'success') {
                alert('Category deleted successfully!');
                location.reload();
                // Optionally, remove the row from the table
                const row = document.querySelector(`tr[data-category-id="${categoryId}"]`);
                if (row) {
                    row.remove();  // Remove the row from the table
                }
            } else {
                alert('Error deleting category: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the category.');
        });
    }
}

