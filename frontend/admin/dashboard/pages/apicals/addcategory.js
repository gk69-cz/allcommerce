document.getElementById('categoryForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevents the form from submitting the default way
console.log('add category');
    // Get values from the form
    const categoryName = document.getElementById('category_name').value;
    const categoryIcon = document.getElementById('category_icon').value;
    const description = document.getElementById('description').value;
 

    // Prepare the data to send in the request
    const categoryData = {  
        category_name: categoryName,
        category_icon: categoryIcon,
        description: description,
        created_at: new Date().toISOString(),  // If empty, set current date
        updated_at: new Date().toISOString()  // If empty, set current date
    };

    // Send data to backend via POST request
    fetch('http://127.0.0.1:5000/api/add-category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Category added successfully!');
            // Optionally, reset form after success
            document.getElementById('categoryForm').reset();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the category');
    });
});
