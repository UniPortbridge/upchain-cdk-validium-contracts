
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
        chainID,
        admin,
        trustedAggregator,
        forkID,
        maticTokenAddress,
	cdkValidiumAddress,
	polygonZkEVMBridgeAddress,
    } = deployOutParameters;

   // const currentProvider = new ethers.providers.JsonRpcProvider(`https://${process.env.HARDHAT_NETWORK}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`); // set goerli RPC node
    const provider = new ethers.providers.JsonRpcProvider(`https://data-seed-prebsc-1-s1.binance.org:8545`);
    async function overrideFeeData() {
        return {
            gasPrice: ethers.utils.parseUnits("5", "gwei"),
        };
    }
    provider.getFeeData = overrideFeeData;
    const privateKey = "0xf5024564ab6508714a6c022d89567a651314937663942e94f925ddaffcbff2cd"; // From wallet.txt Trusted delpoy
    const wallet = new ethers.Wallet(privateKey, provider);
//    const wallet = new ethers.Wallet(process.env.SEQUENCE_PRIVATE_KEY, provider); 

    const maticTokenFactory = await ethers.getContractFactory(
     "ERC20PermitMock",
     provider
    );
    maticTokenContract = maticTokenFactory.attach(maticTokenAddress); // From ~/zkevm/zkevm-contract/deployments/goerly_***/deploy_output.json maticTokenAddress
    maticTokenContractWallet = maticTokenContract.connect(wallet);
    console.log("maticToken approve address:", cdkValidiumAddress);
    
    await maticTokenContractWallet.approve( cdkValidiumAddress, ethers.utils.parseEther("1000000.0"));
     await maticTokenContractWallet.approve( polygonZkEVMBridgeAddress, ethers.utils.parseEther("1000000.0"));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});


