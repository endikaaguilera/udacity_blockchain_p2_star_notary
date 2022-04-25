import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/StarNotary.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = starNotaryArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        starNotaryArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      App.connectedAccount("Account : " + this.account);

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  connectedAccount: function(message) {
    const status = document.getElementById("connectedAccount");
    status.innerHTML = message;
  },
  
  createStarStatus: function(message) {
    const status = document.getElementById("createStarStatus");
    status.innerHTML = message;
  },

  lookUpStarStatus: function(message) {
    const status = document.getElementById("lookUpStarStatus");
    status.innerHTML = message;
  },  

  trasferStarStatus: function(message) {
    const status = document.getElementById("trasferStarStatus");
    status.innerHTML = message;
  },

  exchangeStarStatus: function(message) {
    const status = document.getElementById("exchangeStarStatus");
    status.innerHTML = message;
  },  

  accountStarsStatus: function(message) {
    const stars = document.getElementById("accountStarsStatus");
    stars.innerHTML = message;
  },

  createStar: async function() {
    const { createStar } = this.meta.methods;
    const name = document.getElementById("starName").value;
    const id = document.getElementById("starId").value;
    await createStar(name, id).send({from: this.account});
    App.createStarStatus("New Star Owner is " + this.account + ".");
  },

  // Implement Task 4 Modify the front end of the DAPP
  lookUp: async function (){
    const { lookUptokenIdToStarInfo } = this.meta.methods;
    const tokenId = document.getElementById("lookid").value;
    const result = await lookUptokenIdToStarInfo (tokenId).call({from: this.account});
    if (result !== '') {
      App.lookUpStarStatus("Star name " + result);
    } else {
      App.lookUpStarStatus("Star name not found");
    }    
  },

  // transfer star
  transferStar: async function() {
    const { transferStar } = this.meta.methods;
    const transferStarId = document.getElementById("transferStarId").value;
    const toAddress = document.getElementById("toAddress").value;
    console.log("transferStar: " + "transferStarId: " + transferStarId + " toAddress: " + toAddress);
    const result = await transferStar (toAddress, transferStarId).call({from: this.account});
    App.trasferStarStatus(result);
  },

  // exchangeStars
  exchangeStars: async function() {
    const { exchangeStars } = this.meta.methods;
    const exchangeStarId1 = document.getElementById("exchangeStarId1").value;
    const exchangeStarId2 = document.getElementById("exchangeStarId2").value;
    console.log("exchangeStars: " + "exchangeStarId1: " + exchangeStarId1 + " exchangeStarId2: " + exchangeStarId2);
    const result = await exchangeStars (exchangeStarId1, exchangeStarId2).call({from: this.account});
    App.exchangeStarStatus(result);
  },

  // get account stars ammount
  getStarsOf: async function() {
    const { getStarsOf } = this.meta.methods;
    const userAccount = this.account;
    const result = await getStarsOf (userAccount).call({from: userAccount});
    App.accountStarsStatus("Account Stars: " + result);
  },

};

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
  }

  App.start();
  
});