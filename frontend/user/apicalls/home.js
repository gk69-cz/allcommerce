
window.onload = function() {
    // Call the API to get all categories
    fetch('http://127.0.0.1:5000/api/products', {
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
            populateProductTable(data.products);
        } else {
            console.error("Failed to fetch products:", data.message);
        }
    })
    .catch(error => {
        // Handle any errors
        console.error("Error fetching categories:", error);
    });

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
async function fetchCategories() {
   
    try {
        // Example API endpoint to fetch categories (replace with your actual API endpoint)
        const response = await fetch('http://127.0.0.1:5000/api/get-all-categories');

        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        // Parse the JSON response
        const data = await response.json();

        // Get the select element for entry_type (Category dropdown)
        const categorySelect = document.getElementById('entry_type');

        // Check if categories exist in the response
        if (data && data.categories && Array.isArray(data.categories)) {
            // Clear any existing options
            categorySelect.innerHTML = '<option value="" disabled="" selected="">Select Category</option>';

            // Add each category to the dropdown
            data.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.category_id;  // Set the category_id as the value
                option.textContent = category.category_name;  // Set the category_name as the display text
                categorySelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function populateProductTable(products) {
    const productList = document.getElementById('product-list');

    // Loop through each product in the API response
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('col-sm-6', 'col-md-4', 'col-lg-3');

        productItem.innerHTML = `
            <div class="box">
                <a href="individualProduct.html?id=${product.product_id}">
                    <div class="img-box">
                        <img src="${product.image_url}" alt="${product.name}">
                    </div>
                    <div class="detail-box">
                        <h6>${product.name}</h6>
                        <h6>
                            Price <span>$${parseFloat(product.discounted_price).toFixed(2)}</span>
                        </h6>
                    </div>
                    <div class="new">
                        <span>${product.is_featured ? 'Featured' : 'New'}</span>
                    </div>
                </a>
            </div>
        `;

        // Append the product item to the product list container
        productList.appendChild(productItem);
    });
}


function populateProductTable(products){
    const productList = document.getElementById('product-list');

    // Loop through each product in the API response
    products.forEach(product => {
      const productItem = document.createElement('div');
      productItem.classList.add('col-sm-6', 'col-md-4', 'col-lg-3');

      productItem.innerHTML = `
        <div class="box">
          <a href="">
            <div class="img-box">
              <img src="${product.image_url}" alt="${product.name}">
            </div>
            <div class="detail-box">
              <h6>${product.name}</h6>
              <h6>
                Price <span>$${parseFloat(product.discounted_price).toFixed(2)}</span>
              </h6>
            </div>
            <div class="new">
              <span>${product.is_featured ? 'Featured' : 'New'}</span>
            </div>
          </a>
        </div>
      `;

      // Append the product item to the product list container
      productList.appendChild(productItem);
    });
  }

  function populateCategoryTable(categories) {
    console.log(categories)
    const container = document.getElementById('populateCategoryTable');
    const scrollableContainer = document.createElement('div');
    scrollableContainer.className = 'scrollable-container';
  
    categories.forEach(category => {
      const box = document.createElement('div');
      box.className = 'box';
  
      const img = document.createElement('img');
      img.src = category.category_icon;
      img.alt = category.category_name;
      img.className = 'box-image';
  
      const title = document.createElement('p');
      title.className = 'box-title';
      title.textContent = category.category_name;
  
      box.appendChild(img);
      box.appendChild(title);
      scrollableContainer.appendChild(box);
      
    });
  
    container.appendChild(scrollableContainer);
  }