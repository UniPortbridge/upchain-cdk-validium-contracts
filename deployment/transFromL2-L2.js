const { expect } = require('chai');
const { ethers, upgrades } = require('hardhat');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const deployOutParameters = require('../deployment/deploy_output.json');


async function main() {
    // this code refers to the zkevm-bridge-service/develop/test/scripts/deposit/main.go.
   /*
    *      * Check deploy parameters
    *           * Check that every necessary parameter is fullfilled
    *                */
       const mandatoryDeploymentParameters = [
            'networkName',
            'trustedSequencer',
             'trustedAggregator',
             'maticTokenAddress',
             'cdkValidiumAddress',
	     'polygonZkEVMBridgeAddress',
		           ];

      for (const parameterName of mandatoryDeploymentParameters) {
           if (deployOutParameters[parameterName] === undefined || deployOutParameters[parameterName] === '') {
               throw new Error(`Missing parameter: ${parameterName}`);
           }
      }

      const {
            networkName,
           trustedSequencer,
           trustedAggregator,
           maticTokenAddress,
           cdkValidiumAddress,
	   polygonZkEVMBridgeAddress,
       } = deployOutParameters;


    const networkIDMainnet = 0; //5;
    const networkIDRollup = 1;//1001;

    const  amount1 = ethers.utils.parseEther('0.00001',"gwei"); //not matic token, is eth!
    const provider = ethers.getDefaultProvider("http://127.0.0.1:8545"); // set goerli RPC node
    //const provider = ethers.provider; 
    const wallet = new ethers.Wallet("3fca816e40bcee63e8a7a0b9f7a0863c8937b460e073de3e1b3a60f4d4d0ce26", provider);
  
    const destinationNetwork = networkIDMainnet;
    const destinationAddress =  trustedAggregator; //"0x40df338b1c73d2F555BDd20f1c4394B55686Da55"; 



    const polygonZkevmBridgeFactory = await ethers.getContractFactory(
     "PolygonZkEVMBridge",
     provider
    );
    polygonZkevmBridgeContract = polygonZkevmBridgeFactory.attach("0x1c4D065F91bc1A0C07a220dae322004cA9aD4EC7"); // From ~/zkevm/zkevm-contract/deployments/eploy_output.json
    polygonZkevmBridgeContractWallet = polygonZkevmBridgeContract.connect(wallet);
    console.log("before depositing .....:");//ok
    
    console.log("before :user balance:", await wallet.getBalance());


    const result = await polygonZkevmBridgeContractWallet.bridgeAsset(destinationNetwork, destinationAddress, amount1, "0xa11dCe0b4E0789ABb9981A12F3d154CBd8fdb011", true, '0x',{
        gasLimit: 5500000,
        value: fee,});
     console.log("--------bridgeAsset:",await result);
	                              
      console.log("After deposit :user balance:", await wallet.getBalance());
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

