// Simulación de usuarios
let users = {
    "user1": {
        password: "password123",
        accountNumber: "912-297316-32",
        availableBalance: "$26,059.78",
        personalInfo: {
            address: "Calle 123 #45-67",
            email: "correo@ejemplo.com",
            residenceTime: "5 años",
            maritalStatus: "Soltero",
            dependents: "2",
            currentJob: "Desarrollador de Software",
            monthlySalary: "$3,500,000",
            monthlyExpenses: "$1,500,000",
            debts: "$500,000",
            investments: "$1,000,000"
        }
    }
};

// Mostrar formulario de inicio de sesión
function showLogin() {
    document.getElementById("loginForm").style.display = "flex";
}

// Ocultar formulario de inicio de sesión
function closeLogin() {
    document.getElementById("loginForm").style.display = "none";
}

// Función de inicio de sesión
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (users[username] && users[username].password === password) {
        showUserContent(username);
        closeLogin();
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

// Mostrar el contenido del usuario después de iniciar sesión
function showUserContent(username) {
    const userData = users[username];
    document.getElementById("header").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    document.getElementById("welcomeMessage").textContent = `Hola, ${username}`;
    document.getElementById("accountNumber").textContent = `Número de Cuenta: ${userData.accountNumber}`;
    document.getElementById("availableBalance").textContent = `Saldo disponible: ${userData.availableBalance}`;

    // Información Personal
    const info = userData.personalInfo;
    document.getElementById("address").textContent = info.address;
    document.getElementById("email").textContent = info.email;
    document.getElementById("residenceTime").textContent = info.residenceTime;
    document.getElementById("maritalStatus").textContent = info.maritalStatus;
    document.getElementById("dependents").textContent = info.dependents;
    document.getElementById("currentJob").textContent = info.currentJob;
    document.getElementById("monthlySalary").textContent = info.monthlySalary;
    document.getElementById("monthlyExpenses").textContent = info.monthlyExpenses;
    document.getElementById("debts").textContent = info.debts;
    document.getElementById("investments").textContent = info.investments;
}

// Función para mostrar mensaje de cuenta congelada
function showFrozenMessage() {
    alert("La cuenta está congelada hasta no pagar el impuesto correspondiente.");
}

// Función para abrir el modal del gráfico de pastel
function openChartModal() {
    document.getElementById("chartModal").style.display = "flex";
    renderChart();
}

// Cerrar el modal del gráfico de pastel
function closeChartModal() {
    document.getElementById("chartModal").style.display = "none";
}

// Función para abrir el modal de información adicional de cuenta
function openMoreInfo() {
    document.getElementById("moreInfoModal").style.display = "flex";
}

// Cerrar el modal de información adicional de cuenta
function closeMoreInfo() {
    document.getElementById("moreInfoModal").style.display = "none";
}

// Función para generar y actualizar clave dinámica
function generateDynamicKey() {
    const key = Math.floor(100000 + Math.random() * 900000).toString();
    document.getElementById("dynamicKey").textContent = `Clave Dinámica: ${key}`;
}

// Actualiza la clave dinámica cada 30 segundos
generateDynamicKey();
setInterval(generateDynamicKey, 30000);

// Renderizar el gráfico de pastel
function renderChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Saldo Disponible', 'Saldo Pagado', 'Saldo a Pagar'],
            datasets: [{
                data: [12000, 8000, 4000],
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}
