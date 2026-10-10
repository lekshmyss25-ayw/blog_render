
const name = document.getElementById("name");
const email = document.getElementById("email");

if (name=="" || email=="") {
    alert("Please fill all the fields");
    return false;
}
else if (!email.includes("@")) {
    alert("Please enter a valid email address");
    return false;
}   

else {
    
    const userData = { name: nameValue, email: emailValue };
    localStorage.setItem("userData", JSON.stringify(userData));
}





