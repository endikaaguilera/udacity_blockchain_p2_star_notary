const StarNotary = artifacts.require("StarNotary");

var accounts;

contract('StarNotary', (accs) => {
    accounts = accs;
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    let starName = 'Awesome Star1';
    await instance.createStar(starName, tokenId);
    let lclVar = (await instance.tokenIdToStarInfo.call(tokenId));
    console.log("lclvar ", lclVar);
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), starName);
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".001", "ether");
    await instance.createStar('Awesome Star2', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei("0.01", "ether");
    let balance = web3.utils.toWei("0.05", "ether");
    await instance.createStar('Awesome Star3', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);            
    await instance .approve(user2, starId, {from: user1, gasPrice: 208432350}); 
    await instance.buyStar(starId, { from: user2, value: balance });
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    assert.isBelow(Number(balanceOfUser1BeforeTransaction), Number(balanceOfUser1AfterTransaction));
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star4', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    await instance.approve(user2, starId, { from: user1 })
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    //let user1 = "0xE0982cdcAe2037A7D43bdDf07752F008fE8f5E72";
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star 5', starId, { from: user1 });
    let ownerOfTkn = (await instance.ownerOf.call(starId));
    console.log("user1: ", user1);
    console.log("user2: ", user2);
    console.log("ownerOfTkn: ", ownerOfTkn);
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.approve(user2, starId, {from: user1, gasPrice: 83159864});
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:90668388});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    assert.isBelow(Number(balanceAfterUser2BuysStar), Number(balanceOfUser2BeforeTransaction));
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
    let user1 = accounts[1];
    let tokenId = 6;
    let starName = 'Awesome Star6';
    let instance = await StarNotary.deployed();
    await instance.createStar(starName, tokenId, {from: user1});
    let starData = await instance.tokenIdToStarInfo.call(tokenId);
    console.log("starData ", starData);
    assert.equal(await starData, starName);
});

it('lets 2 users exchange stars', async() => {
    // 1. create 2 Stars with different tokenId
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    
    let user1 = accounts[1];
    let user2 = accounts[2];

    console.log("User1 ", user1);
    console.log("User2 ", user2);

    // create 2 stars and assign one to each user
    let tokenId8 = 8;
    let tokenId9 = 9;
    let instance = await StarNotary.deployed();
    // create star8 for user1
    await instance.createStar('Awesome Star8', tokenId8, { from: user1 });
    assert.equal(await instance.ownerOf.call(tokenId8), user1);
    // check star8 added to mappings
    let starData8 = (await instance.tokenIdToStarInfo.call(tokenId8));
    assert.equal(starData8, 'Awesome Star8');
    // create star9 for user2
    await instance.createStar('Awesome Star9', tokenId9, { from: user2 });
    // check star9 added to mappings
    let starData9 = (await instance.tokenIdToStarInfo.call(tokenId9));
    assert.equal(starData9, 'Awesome Star9');

    let ownerOfTkn8 = (await instance.ownerOf.call(tokenId8));
    let ownerOfTkn9 = (await instance.ownerOf.call(tokenId9));    
    console.log("Before: ownerOfTkn8 ", ownerOfTkn8);
    console.log("Before: ownerOfTkn9 ", ownerOfTkn9);

    // now swap them so user1 has star9 and user2 has star8
    await instance.exchangeStars(tokenId8, tokenId9, {from: user1});
    // check that user2 has Star8

    let ownerOfTkn8A = (await instance.ownerOf.call(tokenId8));
    let ownerOfTkn9A = (await instance.ownerOf.call(tokenId9));    
    console.log("After: ownerOfTkn8 ", ownerOfTkn8A);
    console.log("After: ownerOfTkn9 ", ownerOfTkn9A);
    assert.equal(await instance.ownerOf.call(tokenId8), user2);
    // check that user1 has Star9
    assert.equal(await instance.ownerOf.call(tokenId9), user1);
});

it('lets a user transfer a star', async() => {
    // 1. create a Star with different tokenId
    let user1 = accounts[1];
    let user2 = accounts[2];
    console.log("user1: ", user1);
    console.log("user2: ", user2);
    let tokenId = 10;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star10', tokenId, {from: user1});    
    let initialOwner = (await instance.ownerOf.call(tokenId));
    console.log("initialOwner: ", initialOwner);
    // 2. use the transferStar function implemented in the Smart Contract
    await instance.transferStar(user2, tokenId, { from: user1 });
    let finalOwner = await instance.ownerOf.call(tokenId);    
    console.log("finalOwner: ", finalOwner);
    // 3. Verify the star owner changed.
    assert.equal(await instance.ownerOf(tokenId), user2);
});

it('lookUptokenIdToStarInfo test', async() => {
    // 1. create a Star with different tokenId
    // 2. Call your method lookUptokenIdToStarInfo
    // 3. Verify if you Star name is the same
    let starName = 'Awesome Star11';
    let tokenId = 11;
    let instance = await StarNotary.deployed();
    await instance.createStar(starName, tokenId);
    let starData = await instance.tokenIdToStarInfo.call(tokenId);
    assert.equal(starData, starName);

});
