const ethers = require("ethers");
const fs = require("fs")
const exec  = require('child_process');
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function main() {
    const arrayNames = [
        ["## Deployment Address","deployer"],
        ["## Trusted sequencer","sequencer"],
        ["## Trusted aggregator","aggregator"],
        ["## Claim Tx Manager","claim"]
    ];
    
    var params ="#!/bin/bash";
    
    for (let i = 0; i < arrayNames.length; i++) {
        console.log("\n");
        const wallet = ethers.Wallet.createRandom();
        console.log(arrayNames[i][0]);
        console.log(`Address: ${wallet.address}`);
        console.log(`PrvKey: ${wallet._signingKey().privateKey}`);
        console.log(`mnemonic: "${wallet._mnemonic().phrase}"`);

        const keystoreJson = await wallet.encrypt("password");   //注意此处的密码为 passoword,  在node config文件里面 挂载 钱包的 keystore时，需与此密码一致！
        if(arrayNames[i][1].length>0){
            fs.writeFileSync("./deploy/pk/"+arrayNames[i][1]+".keystore", `${keystoreJson}`);
        }
        if(arrayNames[i][1] == "deployer"){
            var mnemonic = process.env.MNEMONIC;
            var cmd = "sed -i 's/"+mnemonic+"/" + `${wallet._mnemonic().phrase}`+ "/g' ./.env";
            console.log(cmd);
            exec.exec(cmd);

            var admin = process.env.BRIDGE_ADMIN_ADDR;
            cmd ="sed -i 's/"+admin+"/" +`${wallet.address}`+ "/g' ./.env";
            console.log(cmd);
            exec.exec(cmd);

            var adminPrivKey = process.env.DEPLOYER_PRIVATE_KEY;
            cmd ="sed -i 's/"+adminPrivKey+"/" +`${wallet._signingKey().privateKey}`+ "/g' ./.env";
            console.log(cmd);
            exec.exec(cmd);
        }
        
        if(arrayNames[i][1] == "claim"){
            var claimAddr = process.env.CLAIM_ADDR
            cmd ="sed -i 's/"+claimAddr+"/" +`${wallet.address}`+ "/g' ./.env";
            console.log(cmd);
            exec.exec(cmd);
        }

        params = params + "\n";
        params = params+"";
	    var param ="export GLOBAL_PARAM_"+ arrayNames[i][1]+"="+`${wallet.address}`;
	    params = params + param+"\n";
        
        console.log(`keystore: ${keystoreJson}`);
    }
    fs.writeFileSync("./deploy/address_params.sh",params);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
