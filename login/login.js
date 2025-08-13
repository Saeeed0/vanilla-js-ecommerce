window.addEventListener('DOMContentLoaded', () => {
  const savedLogin = localStorage.getItem('rememberLogin');
  if (savedLogin) {
    const { loginInput, password } = JSON.parse(savedLogin);
    document.getElementById('loginInput').value = loginInput;
    document.getElementById('password').value = password;
    document.getElementById('rememberMe').checked = true;
  }
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  document.querySelectorAll('.error').forEach(span => span.textContent = '');

  const loginInput = document.getElementById('loginInput').value.trim();
  const password = document.getElementById('password').value.trim();
  const rememberMe = document.getElementById('rememberMe').checked;

  let isValid = true;

  if (!loginInput) {
    document.getElementById('loginError').textContent = 'Email or Username is required';
    isValid = false;
  }

  if (!password) {
    document.getElementById('passwordError').textContent = 'Password is required';
    isValid = false;
  }

  if (!isValid) return;

  fetch(`http://localhost:3000/users?password=${encodeURIComponent(password)}`)
    .then(res => res.json())
    .then(users => {
      const user = users.find(u => u.email === loginInput || u.username === loginInput);
      
      if (!user) {
        document.getElementById('loginError').textContent = 'Invalid email/username or password';
        return;
      }

      localStorage.setItem('loggedInUser', JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem('rememberLogin', JSON.stringify({ loginInput, password }));
      } else {
        localStorage.removeItem('rememberLogin');
      }

      window.location.href = 'index.html';
    })
    .catch(err => {
      console.error(err);
      document.getElementById('loginError').textContent = 'Error connecting to server';
    });
});
