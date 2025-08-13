document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  document.querySelectorAll('.error').forEach(span => span.textContent = '');

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  let isValid = true;

  if (!firstName) {
    document.getElementById('firstNameError').textContent = 'First name is required';
    isValid = false;
  }

  if (!lastName) {
    document.getElementById('lastNameError').textContent = 'Last name is required';
    isValid = false;
  }

  const phoneRegex = /^\d{11,}$/;
  if (!phoneRegex.test(phone)) {
    document.getElementById('phoneError').textContent = 'Phone must be at least 11 digits';
    isValid = false;
  }

  const usernameRegex = /^[a-z][a-z0-9]*$/;
  if (!usernameRegex.test(username)) {
    document.getElementById('usernameError').textContent = 'Username must start with a letter and contain only lowercase letters and numbers';
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    document.getElementById('emailError').textContent = 'Please enter a valid email';
    isValid = false;
  }

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).+$/;
  if (!passwordRegex.test(password)) {
    document.getElementById('passwordError').textContent = 'Password must contain letters, numbers, and special characters';
    isValid = false;
  }

  if (!isValid) return;

  // التحقق من وجود اليوزر أو الإيميل مسبقًا
  fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`)
    .then(response => response.json())
    .then(existingUsers => {
      if (existingUsers.length > 0) {
        document.getElementById('emailError').textContent = 'Email or username already registered';
        return;
      }

      const newUser = { firstName, lastName, phone, username, email, password };

      fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
      .then(res => {
        if (res.status === 201) {
          window.location.href = '/vanilla-js-ecommerce/login/login.html';
        } else {
          alert('Error registering user.');
        }
      })
      .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
});
