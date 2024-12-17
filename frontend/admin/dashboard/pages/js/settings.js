function toggleFormFields() {
    const entryType = document.getElementById('entry_type').value;
    const bannerFields = document.getElementById('bannerFields');
    const flashSaleFields = document.getElementById('flashSaleFields');

    if (entryType === 'banner') {
        bannerFields.style.display = 'block';
        flashSaleFields.style.display = 'none';
    } else if (entryType === 'flash_sale') {
        bannerFields.style.display = 'none';
        flashSaleFields.style.display = 'block';
    }
}

document.getElementById('unifiedForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const entryType = document.getElementById('entry_type').value;

    if (entryType === 'banner') {
        const bannerData = {
            image_url: document.getElementById('image_url').value,
            title: document.getElementById('title').value,
            link: document.getElementById('link').value,
            priority: parseInt(document.getElementById('priority').value) || 0,
        };
        console.log('Submitting Banner:', bannerData);
        // Make API call for banners
    } else if (entryType === 'flash_sale') {
        const flashSaleData = {
            product_id: parseInt(document.getElementById('product_id').value),
            discounted_price: parseFloat(document.getElementById('discounted_price').value),
            start_time: document.getElementById('start_time').value,
            end_time: document.getElementById('end_time').value,
        };
        console.log('Submitting Flash Sale:', flashSaleData);
        // Make API call for flash sales
    }
});
