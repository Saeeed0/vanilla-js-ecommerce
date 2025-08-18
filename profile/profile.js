let user = localStorage.getItem("loggedInUser");
user = JSON.parse(user);
console.log(user);
//console.log(user.firstName + " " + user.lastName);
const Name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password")
const phone = document.getElementById("phone");
const username = document.getElementById("username");

Name.value=user.firstName + " " + user.lastName;
email.value=user.email;
password.value = user.password;
phone.value = user.phone;
username.value = user.username;


function edit(nextElement){
    const element = nextElement.previousElementSibling;
    element.removeAttribute("readonly");
    element.focus();

    element.addEventListener("blur", () => {
    element.setAttribute("readonly", true);
    }, { once: true });
}
function validate(){
    let isValid = true;
    var firstAndLastName = Name.value.trim().split(" ");
    if (firstAndLastName.length < 2) {
        document.getElementById('nameError').textContent = 'Please provide your first and last name';
        isValid = false;
    }
    else{
        document.getElementById('nameError').textContent = "";
    }
    const phoneRegex = /^\d{11,}$/;
    if (!phoneRegex.test(phone.value.trim())) {
        document.getElementById('phoneError').textContent = 'Phone must be at least 11 digits';
        isValid = false;
    }
    else{
        document.getElementById('phoneError').textContent = "";
    }
    const usernameRegex = /^[a-z][a-z0-9]*$/;
    if (!usernameRegex.test(username.value.trim())) {
        document.getElementById('usernameError').textContent = 'Username must start with a letter and contain only lowercase letters and numbers';
        isValid = false;
    }
    else{
        document.getElementById('usernameError').textContent = "";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        document.getElementById('emailError').textContent = 'Please enter a valid email';
        isValid = false;
    }
    else{
        document.getElementById('emailError').textContent = "";
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).+$/;
    if (!passwordRegex.test(password.value.trim())) {
        document.getElementById('passwordError').textContent = 'Password must contain letters, numbers, and special characters';
        isValid = false;
    }
    else{
        document.getElementById('passwordError').textContent = "";
    }
    return isValid;
}
function save(ev){
    //ev.preventDefault();
    if(!validate()){
        return;
    }
    let path = "http://localhost:3000/users/" + user.id;
    var nm = Name.value.trim().split(" ");
    let updatedUser = JSON.stringify({
        id: user.id,
        firstName: nm[0],
        lastName: nm[1],
        email: email.value.trim(),
        password: password.value.trim(),
        phone: phone.value.trim(),
        username: username.value.trim()
    })
    fetch(path, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json"
    },
    body: updatedUser
    })

    localStorage.setItem("loggedInUser", updatedUser);
    //window.location.href = "profile.html";
}
