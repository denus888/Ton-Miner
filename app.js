const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://denus888.github.io/Ton-Miner/tonconnect-manifest.json"
});

let balance = localStorage.getItem("balance") ? parseFloat(localStorage.getItem("balance")) : 0;
let mining = localStorage.getItem("mining") === "true";
let speed = localStorage.getItem("speed") ? parseFloat(localStorage.getItem("speed")) : 0.000001;

function updateBalance(){
    document.getElementById("balance").innerText = balance.toFixed(6);
    localStorage.setItem("balance", balance);
}

async function connectWallet(){
    try{
        await tonConnectUI.connect();
        alert("Wallet Connected");
    }catch{
        alert("Failed to connect");
    }
}

function startMining(){
    if(mining) return;
    mining = true;
    localStorage.setItem("mining", true);

    setInterval(()=>{
        balance += speed;
        updateBalance();
    },1000);
}

function buyBoost(amount){

    let add = 0;

    if(amount === 1) add = 0.000001929;
    if(amount === 5) add = 0.000005787;
    if(amount === 15) add = 0.0000173611;

    speed += add;
    localStorage.setItem("speed", speed);

    alert("Boost Activated");
}

function invite(){
    alert("Real invite only через Telegram Mini App можна зробити пізніше");
}

function withdraw(){
    if(balance < 1){
        alert("Minimum deposit to withdraw 1 TON");
        return;
    }

    alert("Withdraw Ready");
}

updateBalance();

if(mining){
    startMining();
}