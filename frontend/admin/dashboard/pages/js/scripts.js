
  // Add event listeners to row checkboxes
  const checkboxes = document.querySelectorAll('.row-checkbox');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
      const row = this.closest('tr');
      if (this.checked) {
        row.classList.add('selected');
      } else {
        row.classList.remove('selected');
      }
    });
  });

  // Select all rows
  function selectAll(selectAllCheckbox) {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
      const row = checkbox.closest('tr');
      if (selectAllCheckbox.checked) {
        row.classList.add('selected');
      } else {
        row.classList.remove('selected');
      }
    });
  }
