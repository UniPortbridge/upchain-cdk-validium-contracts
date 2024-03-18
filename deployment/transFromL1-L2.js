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

    const  amount1 = ethers.utils.parseEther('0.1',"gwei"); //not matic token, is eth!
    const  fee= ethers.utils.parseEther(process.env.BRIDGE_FEE_ETHER,"gwei");
    // + bridge fee
    console.log("--------gas fee", fee);
    console.log("--------bridge amount:", amount1);
    const  amount = amount1.add(fee)  ;
    console.log("--------bridge amount:", amount);
    //const provider = ethers.getDefaultProvider("https://rpc.ankr.com/eth_goerli"); // set goerli RPC node
    const provider =  new ethers.providers.JsonRpcProvider(`https://data-seed-prebsc-1-s1.binance.org:8545`);
    async function overrideFeeData() {
        return {
            gasPrice: ethers.utils.parseUnits("5", "gwei"),
        };
    }
    provider.getFeeData = overrideFeeData;
     const wallet = new ethers.Wallet("0x6d096ade1201793b3b8b724336351597e2dc48271d28b469f1170e264c988e43", provider);
  
    const destinationNetwork = networkIDRollup;
    const destinationAddress =  "0xa38E918a53E80a7806d0605370D21cEf3cB2cFcD"; //"0x40df338b1c73d2F555BDd20f1c4394B55686Da55"; 



    const polygonZkevmBridgeFactory = await ethers.getContractFactory(
     "PolygonZkEVMBridge",
     provider
    );
    polygonZkevmBridgeContract = polygonZkevmBridgeFactory.attach(polygonZkEVMBridgeAddress); // From ~/zkevm/zkevm-contract/deployments/eploy_output.json
    polygonZkevmBridgeContractWallet = polygonZkevmBridgeContract.connect(wallet);
    console.log("before depositing .....:");//ok
    
     console.log("before :user balance:", await wallet.getBalance());
     //V1: Polygon bridgeAsset() 
    //const result = await polygonZkevmBridgeContractWallet.bridgeAsset(destinationNetwork, destinationAddress, amount, "0x0000000000000000000000000000000000000000", true, '0x',{
 // gasLimit: 5500000,
  //value: amount,});

	//  //transfer token:
    // const result =   await polygonZkevmBridgeContractWallet.bridgeAsset(destinationNetwork, destinationAddress, amount, maticTokenAddress, true, '0x',{
//	                        gasLimit: 5500000,
//	                        value: 0,}); //send token , value must =0

    //V2: zkFair' bridgeAsset()
    //if ((msg.value - bridgeFee) != amount) { revert AmountDoesNotMatchMsgValue();}
    const result = await polygonZkevmBridgeContractWallet.bridgeAsset(destinationNetwork, destinationAddress, amount1, "0x0000000000000000000000000000000000000000", true, '0x',{
        gasLimit: 5500000,
        value: amount,});
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
