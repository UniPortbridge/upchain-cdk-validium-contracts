
const { expect } = require('chai');
const { ethers, upgrades } = require('hardhat');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const deployOutParameters = require('../deployment/deploy_output.json');



async function main() {
    // zk-node initiating in etd-test. Gavin//
    

    
    /*
     * Check deploy parameters
     * Check that every necessary parameter is fullfilled
     */
    const mandatoryDeploymentParameters = [
        'networkName',
        'trustedSequencer',
        'chainID',
        'admin',
        'trustedAggregator',
        'forkID',
        'maticTokenAddress',
        'cdkValidiumAddress',
    ];

    for (const parameterName of mandatoryDeploymentParameters) {
        if (deployOutParameters[parameterName] === undefined || deployOutParameters[parameterName] === '') {
            throw new Error(`Missing parameter: ${parameterName}`);
        }
    }

    const {
        networkName,
        trustedSequencer,
        chainID,
        admin,
        trustedAggregator,
        forkID,
        maticTokenAddress,
	cdkValidiumAddress,
    } = deployOutParameters;

    //const provider = new ethers.providers.JsonRpcProvider(`https://${process.env.HARDHAT_NETWORK}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`); // set goerli RPC node
    const provider = ethers.provider;
    const privateKey = "0x6d096ade1201793b3b8b724336351597e2dc48271d28b469f1170e264c988e43"; // From wallet.txt  delpoy address 
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const zkevm = await ethers.getContractFactory("CDKValidium");
    const zkevmContract = zkevm.attach(cdkValidiumAddress); // From ~/zkevm-contracts/deployments/goerli_*/deploy_output.json polygonZkEVMAddress

    const zkevmContractWallet = zkevm.connect(wallet);

    await zkevmContract.activateForceBatches();

}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});


