// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "./interfaces/IUpChain20.sol";

contract UpChainExchange  is Ownable, ReentrancyGuard, Pausable {
    using EnumerableSet for EnumerableSet.AddressSet;

    // A set of tokens pegged for conversion with ETH
    EnumerableSet.AddressSet private ethPegTokens;

    event ExchangeTokenForETH(
        address indexed sender,
        address indexed token,
        address indexed to,
        uint256 amount
    );

    event ExchangeETHForToken(
        address indexed sender,
        address indexed token,
        address indexed to,
        uint256 amount
    );

    event AdminChanged(address indexed admin, address indexed newAdmin);

    event PegTokenAdded(address indexed sender, address indexed pegToken);
    event PegTokenRemoved(address indexed sender, address indexed pegToken);

    address public immutable admin;

    constructor(address _admin) {
        admin = _admin;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "ZkbitExchange: caller is not the admin");
        _;
    }


    modifier onlyPegToken(address token) {
        require(
            isEthPegToken(token),
            "ZkbitExchange: token is not the pegToken"
        );
        _;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    // user must approve the contract to transferFrom
    function exchangeTokenForETH(
        address token,
        address to,
        uint256 amount
    ) external whenNotPaused onlyPegToken(token) nonReentrant {
        require(amount > 0, "ZkbitExchange: amount must be greater than 0");
        IUpChain20(token).transferFrom(msg.sender, address(this), amount);
        payable(to).transfer(amount);

        emit ExchangeTokenForETH(msg.sender, token, to, amount);
    }

    function exchangeETHForToken(
        address token,
        address to
    ) external payable whenNotPaused onlyPegToken(token) nonReentrant {
        require(msg.value > 0, "ZkbitExchange: amount must be greater than 0");
        IUpChain20(token).transfer(to, msg.value);

        emit ExchangeETHForToken(msg.sender, token, to, msg.value);
    }

    function addPegToken(address pegToken) external onlyAdmin {
        require(
            pegToken != address(0),
            "ZkbitExchange: pegToken is the zero address"
        );
        require(
            ethPegTokens.add(pegToken),
            "ZkbitExchange: token already exists"
        );

        emit PegTokenAdded(msg.sender, pegToken);
    }

    function removePegToken(address pegToken) external onlyAdmin {
        require(
            ethPegTokens.remove(pegToken),
            "ZkbitExchange: token does not exist"
        );
        emit PegTokenRemoved(msg.sender, pegToken);
    }

    function pause() external onlyAdmin {
        _pause();
    }

    function unpause() external onlyAdmin {
        _unpause();
    }
/*
    function setAdmin(address newAdmin) external onlyAdmin {
        require(
            newAdmin != address(0),
            "ZkbitExchange: new admin is the zero address"
        );
        emit AdminChanged(admin, newAdmin);
        admin = newAdmin;
    }*/

    function withdrawETH(address to, uint256 amount) external onlyAdmin {
        require(address(this).balance >= amount, "insufficient balance");
        payable(to).transfer(amount);
    }

    function pegTokens() external view returns (address[] memory) {
        return ethPegTokens.values();
    }

    function isEthPegToken(address token) public view returns (bool) {
        return ethPegTokens.contains(token);
    }

    function ethPegTokensCount() external view returns (uint256) {
        return ethPegTokens.length();
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
