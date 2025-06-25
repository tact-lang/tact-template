import { toNano, Dictionary } from "@ton/core";
import { Blockchain, SandboxContract } from "@ton/sandbox";
import { updateConfig } from "@ton/sandbox";
import { StoragePrices } from "@ton/sandbox/dist/config/config.tlb-gen";
import "@ton/test-utils";
import { SampleTactContract } from "./output/sample_SampleTactContract";

const globalSetup = async () => {
    const blockchain = await Blockchain.create();

    // --- if we don't test storage prices, we need to set them to 0 ---
    const storagePricesDict = Dictionary.empty<number, StoragePrices>();

    storagePricesDict.set(0, {
        kind: "StoragePrices",
        utime_since: 0,
        bit_price_ps: 0n,
        _cell_price_ps: 0n,
        mc_bit_price_ps: 0n,
        mc_cell_price_ps: 0n,
    });

    const updatedConfig = updateConfig(blockchain.config, {
        kind: "ConfigParam__18",
        anon0: storagePricesDict,
    });

    blockchain.setConfig(updatedConfig);
    // ---

    const owner = await blockchain.treasury("admin");
    const nonOwner = await blockchain.treasury("non-owner");

    const contract: SandboxContract<SampleTactContract> = blockchain.openContract(
        await SampleTactContract.fromInit(owner.address, 0n)
    );

    const deployResult = await contract.send(owner.getSender(), { value: toNano(1) }, null);

    expect(deployResult.transactions).toHaveTransaction({
        from: owner.address,
        to: contract.address,
        deploy: true,
        success: true,
    });

    return { blockchain, owner, nonOwner, contract };
};

const testDeploy = () => {
    describe("test deploy", () => {
        const setup = async () => {
            return await globalSetup();
        };

        it("should deploy correctly", async () => {
            const { contract } = await setup();

            const counter = await contract.getCounter();
            expect(counter).toEqual(0n);
        });
    });
};

const testIncrement = () => {
    const setup = async () => {
        return await globalSetup();
    };

    describe("test increment", () => {
        it("should increment counter by owner", async () => {
            const { owner, contract } = await setup();

            // Increment counter
            await contract.send(owner.getSender(), { value: toNano(1) }, { $$type: "Increment" });

            // Check counter
            expect(await contract.getCounter()).toEqual(1n);
        });

        it("should not increment counter by non-owner", async () => {
            const { nonOwner, contract } = await setup();

            // Increment counter
            const result = await contract.send(nonOwner.getSender(), { value: toNano(1) }, { $$type: "Increment" });

            expect(result.transactions).toHaveTransaction({
                from: nonOwner.address,
                to: contract.address,
                success: false,
                exitCode: SampleTactContract.errors["Access denied"],
            });
        });
    });
};

const testAdd = () => {
    const setup = async () => {
        return await globalSetup();
    };

    describe("test add", () => {
        it("should add amount by owner", async () => {
            const { owner, contract } = await setup();

            // Add amount
            await contract.send(owner.getSender(), { value: toNano(10) }, { $$type: "Add", amount: 10n });

            // Check counter
            expect(await contract.getCounter()).toEqual(10n);
        });

        it("should not add amount by non-owner", async () => {
            const { nonOwner, contract } = await setup();

            // Add amount
            const result = await contract.send(
                nonOwner.getSender(),
                { value: toNano(10) },
                { $$type: "Add", amount: 10n }
            );

            expect(result.transactions).toHaveTransaction({
                from: nonOwner.address,
                to: contract.address,
                success: false,
                exitCode: SampleTactContract.errors["Access denied"],
            });
        });
    });
};

export const testContract = () => {
    testDeploy();
    testIncrement();
    testAdd();
};
