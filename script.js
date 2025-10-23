let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
let expensesPieChart; 

function openModal() {
  document.getElementById("expenseModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("expenseModal").style.display = "none";
  document.getElementById("amount").value = "";
  document.getElementById("category").value = "";
  document.getElementById("description").value = "";
  document.getElementById("type").value = "income";
}

function addTransaction() {
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const type = document.getElementById("type").value;

  if (!amount || !category || !description || !type) {
    alert("Please fill all fields.");
    return;
  }

  
  let currentIncome = 0;
  let currentExpense = 0;
  transactions.forEach(t => {
    if (t.type === "income") currentIncome += t.amount;
    else currentExpense += t.amount;
  });

  
  if (type === "expense" && (currentIncome - currentExpense - amount) < 0) {
    alert("Error: Expense cannot exceed total income!");
    return; 
  }

  const transaction = {
    id: Date.now(),
    amount,
    category,
    description,
    type
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  closeModal();
  renderTransactions();
  renderExpensesPieChart(); 
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
  renderExpensesPieChart(); 
}

function renderTransactions() {
  const transactionList = document.getElementById("transactionList");
  transactionList.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions.slice().reverse().forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;

    const div = document.createElement("div");
    div.className = "expense-item";
    div.innerHTML = `
      <div>
        <strong>${t.type === "income" ? "+" : "-"} ₹${t.amount.toFixed(2)}</strong><br/>
        <small>${t.category} | ${t.description}</small>
      </div>
      <button onclick="deleteTransaction(${t.id})">Delete</button>
    `;
    transactionList.appendChild(div);
  });

  document.getElementById("totalIncome").textContent = `₹${income.toFixed(2)}`;
  document.getElementById("totalExpenses").textContent = `₹${expense.toFixed(2)}`;
  document.getElementById("netBalance").textContent = `₹${(income - expense).toFixed(2)}`;
}

function renderExpensesPieChart() {
  const expenseData = {};
  transactions.forEach(t => {
    if (t.type === "expense") {
      if (expenseData[t.category]) {
        expenseData[t.category] += t.amount;
      } else {
        expenseData[t.category] = t.amount;
      }
    }
  });

  const labels = Object.keys(expenseData);
  const data = Object.values(expenseData);

  const ctx = document.getElementById('expensesPieChart').getContext('2d');

  
  if (expensesPieChart) {
    expensesPieChart.destroy();
  }

  expensesPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed !== null) {
                label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed);
              }
              return label;
            }
          }
        }
      }
    }
  });
}


function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}

window.addEventListener("load", () => {
  renderTransactions();
  renderExpensesPieChart(); 
});