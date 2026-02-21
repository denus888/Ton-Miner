const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://Ton_Miner.github.io/tonconnect-manifest.json"
});

let balance = parseFloat(localStorage.getItem("balance")) || 0;
let mining = localStorage.getItem("mining") === "true" || false;
let miningSpeed = parseFloat(localStorage.getItem("miningSpeed")) || 0.000001;
let miningInterval = null;

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
        alert("Withdraw requested: " + balance.toFixed(6) + " TON");
    }
}

function inviteFriends() {
    balance += 0.01;
    localStorage.setItem("balance", balance);
    updateBalanceUI();
    alert("You invited a friend! +0.01 TON");
}

document.addEventListener("DOMContentLoaded", () => {
    updateBalanceUI();
    if (mining) startMining();
});