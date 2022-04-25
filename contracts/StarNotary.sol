//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//Importing openzeppelin-solidity ERC-721 implemented Standard
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

// StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation
contract StarNotary is ERC721 {
    constructor() ERC721("StarNotaryToken", "SNT") {}

    // Star data
    struct Star {
        string name;
    }

    bytes16 private constant _HEX_SYMBOLS = "0123456789abcdef";

    // mapping the Star with the Owner Address
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // mapping the TokenId and price
    mapping(uint256 => uint256) public starsForSale;

    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public {
        // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name); // Star is an struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping
        _mint(msg.sender, _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(
            ownerOf(_tokenId) == msg.sender,
            "You can't sell the Star you don't owned"
        );
        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value > starCost, "You don't have enough Ether...");
        transferFrom(ownerAddress, msg.sender, _tokenId);
        address payable ownerAddressPayable = payable(ownerAddress);
        ownerAddressPayable.transfer(starCost);
        if (msg.value > starCost) {
            address payable callerAddressPayable = payable(msg.sender);
            callerAddressPayable.transfer(msg.value - starCost);
        }
    }

    // Implement Task 1 lookUptokenIdToStarInfo
    function lookUptokenIdToStarInfo(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        //1. You should return the Star saved in tokenIdToStarInfo mapping
        Star memory returnStar = tokenIdToStarInfo[_tokenId];
        return returnStar.name;
    }

    // Implement Task 1 Exchange Stars function
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2)
        public
        returns (string memory)
    {
        //1. Passing to star tokenId you will need to check if the owner of _tokenId1 or _tokenId2 is the sender
        //2. You don't have to check for the price of the token (star)
        //3. Get the owner of the two tokens (ownerOf(_tokenId1), ownerOf(_tokenId2)
        //4. Use _transferFrom function to exchange the tokens.
        address from = ownerOf(_tokenId1);
        address to = ownerOf(_tokenId2);
        require(
            msg.sender == from || msg.sender == to,
            "Sender must own the star"
        );
        _transfer(from, to, _tokenId1);
        _transfer(to, from, _tokenId2);
        address ownerAfterTransferStar1 = ownerOf(_tokenId1);
        address ownerAfterTransferStar2 = ownerOf(_tokenId2);
        string memory r1 = string(
            abi.encodePacked(
                "Owner after transfer star ID 1:",
                " ",
                toHexString(uint256(uint160(ownerAfterTransferStar1)), 20)
            )
        );
        string memory r2 = string(
            abi.encodePacked(
                ", Owner after transfer star ID 2:",
                " ",
                toHexString(uint256(uint160(ownerAfterTransferStar2)), 20)
            )
        );
        return string(abi.encodePacked(r1, " ", r2));
    }

    // Implement Task 1 Transfer Stars
    function transferStar(address _to, uint256 _tokenId)
        public
        returns (string memory)
    {
        //1. Check if the sender is the ownerOf(_tokenId)
        //2. Use the transferFrom(from, to, tokenId); function to transfer the Star
        address owner = ownerOf(_tokenId);
        require(owner == msg.sender, "You have to own the token");
        //approve(_to, _tokenId);
        transferFrom(owner, _to, _tokenId);
        address ownerAfterTransfer = ownerOf(_tokenId);
        return
            string(
                abi.encodePacked(
                    "Owner after transfer:",
                    " ",
                    toHexString(uint256(uint160(ownerAfterTransfer)), 20)
                )
            );
    }

    // Get account stars balance
    function getStarsOf(address _owner) external view returns (uint256) {
        return balanceOf(_owner);
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function toHexString(uint256 value, uint256 length)
        internal
        pure
        returns (string memory)
    {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _HEX_SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }
}
