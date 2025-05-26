import { Address, toNano } from "@ton/core";
import { Blockchain, SandboxContract } from "@ton/sandbox";
import "@ton/test-utils";
import { SampleTactContract } from "./output/sample_SampleTactContract";
import { setStoragePrices } from "./gas-utils";

type FromInitContract = (owner: Address, counter: bigint) => Promise<SampleTactContract>;

const globalSetup = async (fromInitContract: FromInitContract) => {
    const blockchain = await Blockchain.create();

    // if we don't test storage prices, we need to set them to 0
    blockchain.setConfig(
        setStoragePrices(blockchain.config, {
            unixTimeSince: 0,
            bitPricePerSecond: 0n,
            cellPricePerSecond: 0n,
            masterChainBitPricePerSecond: 0n,
            masterChainCellPricePerSecond: 0n,
        })
    );

    const owner = await blockchain.treasury("owner");
    const nonOwner = await blockchain.treasury("non-owner");
    const contract: SandboxContract<SampleTactContract> = blockchain.openContract(
        await fromInitContract(owner.address, 0n)
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

const testDeploy = (fromInitContract: FromInitContract) => {
    describe("test deploy", () => {
        const setup = async () => {
            return await globalSetup(fromInitContract);
        };
        
        it("should deploy correctly", async () => {
            const { contract } = await setup();

            const counter = await contract.getCounter();
            expect(counter).toEqual(0n);
        });
    });
};

const testIncrement = (fromInitContract: FromInitContract) => {
    const setup = async () => {
        return await globalSetup(fromInitContract);
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

const testAdd = (fromInitContract: FromInitContract) => {
    const setup = async () => {
        return await globalSetup(fromInitContract);
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

export const testContract = (fromInitContract: FromInitContract) => {
    testDeploy(fromInitContract);
    testIncrement(fromInitContract);
    testAdd(fromInitContract);
};
