
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
    //const provider = ethers.provider;
    const provider = new ethers.providers.JsonRpcProvider(`https://data-seed-prebsc-1-s1.binance.org:8545`);
    async function overrideFeeData() {
        return {
            gasPrice: ethers.utils.parseUnits("5", "gwei"),
        };
    }

    provider.getFeeData = overrideFeeData;
    
    const privateKey = "4f76ea8b24f437d06af85dc9cdac69ddc31fa7cf5b5b15a385c1d2be286fee71"; // From wallet.txt  delpoy address 
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const cdkDataCommitteeContractFactory = await ethers.getContractFactory(
        "CDKDataCommittee",
        provider
    );
    cdkDataCommitteeContract = cdkDataCommitteeContractFactory.attach("0x0ba1285708e760b4C2B1CD7DDb40aF5aBBEc696E"); 
    cdkDataCommitteeContractWallet = cdkDataCommitteeContract.connect(wallet);	
    
    const member1Address = Buffer.from("047df7362469e95e75918ece51f20d083f5c7fcc","hex")
    await expect(cdkDataCommitteeContract.setupCommittee(1, ["http://172.16.58.68:8444"], member1Address))
            .to.emit(cdkDataCommitteeContract, 'CommitteeUpdated')

    console.log('Empty committee seted up');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});



