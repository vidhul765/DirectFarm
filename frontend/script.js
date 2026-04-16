async function addProduct() {
    console.log("clicked");
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").files[0];
    const user = localStorage.getItem("user");

    if (!user) {
        window.location.href = "login.html";
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", image);

    const res = await fetch("http://localhost:3000/add-product", {
        method: "POST",
        body: formData
    });

    const text = await res.text();
    console.log(text); // 👈 IMPORTANT (check if "Product added")

    loadProducts();
}

async function loadProducts() {
    const res = await fetch("http://localhost:3000/products");
    const data = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

    data.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            ${p.image ? `<img src="http://localhost:3000/uploads/${p.image}">` : ""}
            <h3>${p.name}</h3>
            <p>Price: ₹${p.price}</p>
            <button onclick="deleteProduct(${p.id})">Delete</button>
        `;

        list.appendChild(div);
    });
}
async function deleteProduct(id) {
    await fetch(`http://localhost:3000/delete/${id}`, {
        method: "DELETE"
    });

    loadProducts();
}
loadProducts();