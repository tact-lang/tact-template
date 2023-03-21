import * as fs from 'fs';
import * as path from 'path';
import { beginCell } from "ton";
import { storeAdd } from "./output/sample_SampleTactContract";
import { prepareTactDeployment } from "@tact-lang/deployer";

(async () => {

    // Parameters
    let packed = beginCell().store(storeAdd({ $$type: 'Add', amount: 10n })).endCell(); // Replace if you want another message used

    // Prepareing
    console.log('Uploading package...');
    let prepare = await prepareTactDeployment({
        pkg: fs.readFileSync(path.resolve(__dirname, 'output', 'sample_SampleTactContract.pkg')),
        data: packed.toBoc(),
        testnet: true // Change for mainnet
    });

    // Deploying
    console.log("============================================================================================");
    console.log('Please, follow deployment link')
    console.log("============================================================================================");
    console.log();
    console.log(prepare);
    console.log();
    console.log("============================================================================================");
})();