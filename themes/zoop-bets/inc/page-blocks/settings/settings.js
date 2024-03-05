document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('user-settings');
  var formMessage = document.querySelector('.form-message');


  if (form) {
    form.addEventListener('submit', function (event) {
      // Prevent the form from actually submitting for this example

      // Add the 'content_area' class to the form-message element
      formMessage.classList.add('content_area');
      formMessage.style.display = 'block';
    });
  }
});