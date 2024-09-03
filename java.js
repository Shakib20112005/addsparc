let inventory = [];
let bill = [];

function addProduct() {
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const quantity = parseInt(document.getElementById('product-quantity').value);

    if (name && price && quantity) {
        const product = { name, price, quantity };
        inventory.push(product);
        updateInventoryTable();
    } else {
        alert('Please enter valid product details.');
    }
}

function updateInventoryTable() {
    const inventoryBody = document.getElementById('inventory-body');
    inventoryBody.innerHTML = '';

    inventory.forEach((product, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td draggable="true" ondragstart="drag(event)" data-index="${index}">${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
        `;

        inventoryBody.appendChild(row);
    });
}

function allowDrop(event) {
    event.preventDefault();
    const billingArea = document.getElementById('billing-area');
    billingArea.classList.add('dragover');
}

function drop(event) {
    event.preventDefault();
    const billingArea = document.getElementById('billing-area');
    billingArea.classList.remove('dragover');

    const index = event.dataTransfer.getData('text');
    addToBill(index);
}

function drag(event) {
    event.dataTransfer.setData('text', event.target.getAttribute('data-index'));
}

function addToBill(index) {
    const product = inventory[index];
    if (product.quantity > 0) {
        product.quantity--;
        const billItem = bill.find(item => item.name === product.name);

        if (billItem) {
            billItem.quantity++;
        } else {
            bill.push({ name: product.name, price: product.price, quantity: 1 });
        }

        updateInventoryTable();
        updateBillingTable();
    } else {
        alert('Product is out of stock.');
    }
}

function updateBillingTable() {
    const billingBody = document.getElementById('billing-body');
    const totalAmount = document.getElementById('total-amount');
    let total = 0;

    billingBody.innerHTML = '';

    bill.forEach(item => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
        `;

        total += item.price * item.quantity;
        billingBody.appendChild(row);
    });

    totalAmount.textContent = total.toFixed(2);
}
