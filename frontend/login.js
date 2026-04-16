async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    alert("Registered!");
}

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
        alert("Login successful");

        // save user
        localStorage.setItem("user", JSON.stringify(data.user));

        // redirect
        window.location.href = "index.html";
    } else {
        alert("Invalid credentials");
    }
}