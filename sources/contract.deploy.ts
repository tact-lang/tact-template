import * as fs from 'fs';
import * as path from 'path';
import { Address, contractAddress } from "ton";
import { SampleTactContract } from "./output/sample_SampleTactContract";
import { prepareTactDeployment } from "@tact-lang/deployer";
import { createInitPackage } from './utils/createInitPackage';

(async () => {

    // Parameters
    let testnet = true;
    let packageName = 'sample_SampleTactContract.pkg';
    let owner = Address.parse('<put_address_here>');
    let contractInit = await SampleTactContract.init(owner);

    // Load required data
    let address = contractAddress(0, contractInit);
    let data = createInitPackage(contractInit);
    let pkg = fs.readFileSync(path.resolve(__dirname, 'output', packageName));

    // Prepareing
    console.log('Uploading package...');
    let prepare = await prepareTactDeployment({ pkg, data, testnet });

    // Deploying
    console.log("============================================================================================");
    console.log('Contract Address')
    console.log("============================================================================================");
    console.log();
    console.log(address.toString({ testOnly: testnet }));
    console.log();
    console.log("============================================================================================");
    console.log('Please, follow deployment link')
    console.log("============================================================================================");
    console.log();
    console.log(prepare);
    console.log();
    console.log("============================================================================================");
})();