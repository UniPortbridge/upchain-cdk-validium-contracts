// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

interface IUpChainExchange {
    // user must approve the contract to transferFrom
    function exchangeTokenForETH(
        address token,
        address to,
        uint256 amount
    ) external;
    
    function exchangeETHForToken(address token, address to) external payable;
}
