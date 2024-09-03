let inventory = [];
let bill = [];
let savedBills = [];
let billCounter = 1;

function addProduct() {
    const name = document.getElementById('product-name').value;
    const purchaseRate = parseFloat(document.getElementById('purchase-rate').value);
    const price = parseFloat(document.getElementById('product-price').value);
    const quantity = parseInt(document.getElementById('product-quantity').value);

    if (name && purchaseRate && price && quantity) {
        const product = { name, purchaseRate, price, quantity };
        inventory.push(product);
        updateInventoryTable();
        clearInputFields();
    } else {
        alert('Please enter valid product details.');
    }
}

function clearInputFields() {
    document.getElementById('product-name').value = '';
    document.getElementById('purchase-rate').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-quantity').value = '';
}

function updateInventoryTable() {
    const inventoryBody = document.getElementById('inventory-body');
    inventoryBody.innerHTML = '';

    inventory.forEach((product, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product.name}</td>
            <td>₹${product.purchaseRate.toFixed(2)}</td>
            <td>₹${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td><button class="add-to-bill" onclick="addToBill(${index})">Add to Bill</button></td>
        `;

        inventoryBody.appendChild(row);
    });
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
            <td>₹${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>₹${(item.price * item.quantity).toFixed(2)}</td>
        `;

        total += item.price * item.quantity;
        billingBody.appendChild(row);
    });

    totalAmount.textContent = total.toFixed(2);
}

function saveBill() {
    if (bill.length === 0) {
        alert('No items in the bill to save.');
        return;
    }

    const billId = billCounter++;
    const totalAmount = document.getElementById('total-amount').textContent;
    const dateTime = new Date().toLocaleString();
    const savedBill = {
        id: billId,
        dateTime: dateTime,
        totalAmount: totalAmount,
        items: bill.slice(),
    };

    savedBills.push(savedBill);
    updateDayBookTable();
    bill = [];  // Clear the current bill after saving
    updateBillingTable();
}

function updateDayBookTable() {
    const dayBookBody = document.getElementById('day-book-body');
    dayBookBody.innerHTML = '';

    savedBills.forEach(bill => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${bill.id}</td>
            <td>${bill.dateTime}</td>
            <td>₹${bill.totalAmount}</td>
            <td><button onclick="viewBill(${bill.id})">View</button></td>
            <td><button onclick="printBill(${bill.id})" class="print-bill">Print</button></td>
        `;

        dayBookBody.appendChild(row);
    });
}

function viewBill(billId) {
    const bill = savedBills.find(b => b.id === billId);
    if (bill) {
        let billContent = `
            <h3>Bill ID: ${bill.id}</h3>
            <p>Date & Time: ${bill.dateTime}</p>
            <p>Total Amount: ₹${bill.totalAmount}</p>
            <h4>Items:</h4>
            <ul>
        `;

        bill.items.forEach(item => {
            billContent += `<li>${item.name} - ₹${item.price} x ${item.quantity}</li>`;
        });

        billContent += '</ul>';

        alert(billContent); // Display bill details as an alert (you can change this to a modal or a new page)
    } else {
        alert('Bill not found.');
    }
}

function printBill(billId) {
    const bill = savedBills.find(b => b.id === billId);
    if (bill) {
        let billContent = `
            <h3>Bill ID: ${bill.id}</h3>
            <p>Date & Time: ${bill.dateTime}</p>
            <p>Total Amount: ₹${bill.totalAmount}</p>
            <h4>Items:</h4>
            <ul>
        `;

        bill.items.forEach(item => {
            billContent += `<li>${item.name} - ₹${item.price} x ${item.quantity}</li>`;
        });

        billContent += '</ul>';

        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write('<html><head><title>Print Bill</title></head><body>');
        printWindow.document.write(billContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    } else {
        alert('Bill not found.');
    }
}
