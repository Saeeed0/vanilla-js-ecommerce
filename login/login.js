window.addEventListener('DOMContentLoaded', () => {
  // استرجاع الـ loginInput دايمًا
  const savedLoginInput = localStorage.getItem('loginInput');
  if (savedLoginInput) {
    document.getElementById('loginInput').value = savedLoginInput;
  }

  // استرجاع بيانات تذكرني (الباسورد)
  const savedRemember = localStorage.getItem('rememberLogin');
  if (savedRemember) {
    const { loginInput, password } = JSON.parse(savedRemember);
    document.getElementById('loginInput').value = loginInput; // يكتبها تاني لو فيه تذكرني
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

   // احفظ الـ loginInput دايمًا
    localStorage.setItem('loginInput', loginInput);

if (rememberMe) {
  // لو المستخدم اختار تذكرني، احفظ الاتنين مع بعض
  localStorage.setItem(
    'rememberLogin',
    JSON.stringify({ loginInput, password })
  );
} else {
  // لو ما اختارش، احذف البيانات المخزنة للباسورد
  localStorage.removeItem('rememberLogin');
}
      window.location.href = '/vanilla-js-ecommerce/index.html';
    })
    .catch(err => {
      console.error(err);
      document.getElementById('loginError').textContent = 'Error connecting to server';
    });
});
