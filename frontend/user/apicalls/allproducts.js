const priceRanges = ["Under $50", "$50 - $100", "$100 - $500", "Over $500"];
const alphabeticalOptions = ["A-Z", "Z-A"];
window.onload = function() {

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
    
    populateCarousel
    fetchCategories
}
function populateCarousel() {
    const carouselInner = document.getElementById("carousel-inner");
  
    productData.products.forEach((product, index) => {
      const slide = document.createElement("div");
      slide.className = `carousel-item ${index === 0 ? "active" : ""}`; // Set the first slide as active
  
      slide.innerHTML = `
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-7">
        <div class="detail-box">
          <h1>Discover Premium Products</h1>
          <p>Explore top-quality items curated just for you. Shop now and elevate your lifestyle.</p>
          <a href="#start-shopping">Start Shopping</a>
        </div>
      </div>
      <div class="col-md-5">
        <div class="img-box">
          <img src="C:/Users/zacha/OneDrive/Desktop/allcommerce/allcommerce/image/phone.jpg" alt="Premium Products" />
        </div>
      </div>
    </div>
  </div>
`;

populateCategoriesDropdown()
// Append the slide to the carousel
carouselInner.appendChild(slide);
    });
  }

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


  // Function to populate Categories dropdown dynamically
function populateCategoriesDropdown() {
    const dropdownContent = document.getElementById("categories-dropdown");
    dropdownContent.innerHTML = ''; // Clear any existing options

    // Fetch categories from the API
    fetch('http://127.0.0.1:5000/api/get-all-categories')
        .then(response => response.json())
        .then(data => {
            if (data && data.categories && Array.isArray(data.categories)) {
                data.categories.forEach(category => {
                    const categoryOption = document.createElement("a");
                    categoryOption.textContent = category.category_name; // Set the display text
                    categoryOption.href = "#"; // Add link functionality if needed
                    categoryOption.onclick = () => handleCategorySelection(category.category_id); // Function call on selection
                    dropdownContent.appendChild(categoryOption);
                });
            } else {
                console.error("No categories found in the API response.");
            }
        })
        .catch(error => {
            console.error("Error fetching categories for dropdown:", error);
        });
}