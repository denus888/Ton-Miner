// Ton Miner Mini App - Persistent + Boost & Withdraw Popups
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://Ton_Miner.github.io/tonconnect-manifest.json"
});

// ==== Ваш TON гаманець для виводу ====
const walletAddress = "UQDfIScKOZ4uOyayFZgYsRYX1iWUIQn7Yi0kbPirBoGsLIXW"; // <- встав свій TON адресу сюди

// ==== Змінні ====
let balance = parseFloat(localStorage.getItem("balance")) || 0;
let mining = localStorage.getItem("mining") === "true" || false;
let miningSpeed = parseFloat(localStorage.getItem("miningSpeed")) || 0.000001;
let miningInterval = null;

// Для мінімального депозиту для withdraw
let minDeposit = parseFloat(localStorage.getItem("minDeposit")) || 1;

// ==== UI оновлення ====
function updateBalanceUI() {
    document.getElementById("balance").innerText = balance.toFixed(6);
}

// ==== TonConnect ====
async function connectWallet() {
    try {
        const wallet = await tonConnectUI.connect();
        alert("Wallet connected: " + wallet.account.address);
    } catch (err) {
        console.error(err);
        alert("Failed to connect wallet");
    }
}

// ==== Майнінг ====
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

// ==== Boost ====
function showBoost(amount) {
    let increment = 0;
    if (amount === 1) increment = 0.000001929;
    else if (amount === 5) increment = 0.000005787;
    else if (amount === 15) increment = 0.0000173611;

    alert(`Boost: +${increment} TON for ${amount} TON`);

    // Збільшуємо швидкість майнінгу
    miningSpeed += increment;
    localStorage.setItem("miningSpeed", miningSpeed);
}

function buyBoost(amount) {
    showBoost(amount);
}

// ==== Withdraw ====
function showWithdraw() {
    if (balance < minDeposit) {
        alert(`Minimum deposit to withdraw ${minDeposit} TON`);
    } else {
        alert(`Withdraw requested: ${balance.toFixed(6)} TON to wallet ${walletAddress}`);
        // після успішного внесення депозита мінімум підвищується
        minDeposit = 5;
        localStorage.setItem("minDeposit", minDeposit);
        balance = 0; // обнуляємо баланс після заявки
        localStorage.setItem("balance", balance);
        updateBalanceUI();
    }
}

function withdraw() {
    showWithdraw();
}

// ==== Invite ====
function inviteFriends() {
    balance += 0.01;
    localStorage.setItem("balance", balance);
    updateBalanceUI();
    alert("You invited a friend! +0.01 TON");
}

// ==== Додаємо функції до window для onclick ====
window.connectWallet = connectWallet;
window.startMining = startMining;
window.buyBoost = buyBoost;
window.withdraw = withdraw;
window.inviteFriends = inviteFriends;

// ==== DOM Ready ====
document.addEventListener("DOMContentLoaded", () => {
    updateBalanceUI();
    if (mining) startMining();
});