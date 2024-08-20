import { toNano } from "@ton/core";
import { Blockchain } from "@ton/sandbox";
import "@ton/test-utils";
import { SampleTactContract } from "./output/sample_SampleTactContract";
import { findErrorCodeByMessage } from './utils/error';

describe("contract", () => {
    it("should deploy correctly", async () => {
        // Create Sandbox and deploy contract
        let system = await Blockchain.create();
        let owner = await system.treasury("owner");
        let nonOwner = await system.treasury("non-owner");
        let contract = system.openContract(await SampleTactContract.fromInit(owner.address));
        const deployResult = await contract.send(owner.getSender(), { value: toNano(1) }, { $$type: "Deploy", queryId: 0n });
        expect(deployResult.transactions).toHaveTransaction({
            from: owner.address,
            to: contract.address,
            deploy: true,
            success: true,
        });

        // Check counter
        expect(await contract.getCounter()).toEqual(0n);

        // Increment counter
        await contract.send(owner.getSender(), { value: toNano(1) }, "increment");

        // Check counter
        expect(await contract.getCounter()).toEqual(1n);

        // Non-owner
        const nonOwnerResult = await contract.send(nonOwner.getSender(), { value: toNano(1) }, "increment");
        const errorCodeForInvalidSender = findErrorCodeByMessage(contract.abi.errors, "Invalid sender");
        expect(nonOwnerResult.transactions).toHaveTransaction({
            from: nonOwner.address,
            to: contract.address,
            success: false,
            exitCode: errorCodeForInvalidSender!!
        });
    });
});
