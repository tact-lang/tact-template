import { toNano } from "ton";
import { ContractSystem } from "@tact-lang/emulator";
import { SampleTactContract } from "./output/sample_SampleTactContract";

describe("contract", () => {
    it("should deploy correctly", async () => {
        // Create ContractSystem and deploy contract
        let system = await ContractSystem.create();
        let owner = system.treasure("owner");
        let nonOwner = system.treasure("non-owner");
        let contract = system.open(await SampleTactContract.fromInit(owner.address));
        let track = system.track(contract.address);
        await contract.send(owner, { value: toNano(1) }, { $$type: "Deploy", queryId: 0n });
        await system.run();
        expect(track.collect()).toMatchInlineSnapshot(`
            [
              {
                "$seq": 0,
                "events": [
                  {
                    "$type": "deploy",
                  },
                  {
                    "$type": "received",
                    "message": {
                      "body": {
                        "cell": "x{946A98B60000000000000000}",
                        "type": "cell",
                      },
                      "bounce": true,
                      "from": "kQAI-3FJVc_ywSuY4vq0bYrzR7S4Och4y7bTU_i5yLOB3A6P",
                      "to": "kQA0B12Z-IVBSmgGwFmKk8bfxldQ7A5Qt3PZPIV65cLwsaux",
                      "type": "internal",
                      "value": 1000000000n,
                    },
                  },
                  {
                    "$type": "processed",
                    "gasUsed": 8307n,
                  },
                  {
                    "$type": "sent",
                    "messages": [
                      {
                        "body": {
                          "cell": "x{AFF90F570000000000000000}",
                          "type": "cell",
                        },
                        "bounce": true,
                        "from": "kQA0B12Z-IVBSmgGwFmKk8bfxldQ7A5Qt3PZPIV65cLwsaux",
                        "to": "kQAI-3FJVc_ywSuY4vq0bYrzR7S4Och4y7bTU_i5yLOB3A6P",
                        "type": "internal",
                        "value": 990497000n,
                      },
                    ],
                  },
                ],
              },
            ]
        `);

        // Check counter
        expect(await contract.getCounter()).toEqual(0n);

        // Increment counter
        await contract.send(owner, { value: toNano(1) }, "increment");
        await system.run();
        expect(track.collect()).toMatchInlineSnapshot(`
            [
              {
                "$seq": 1,
                "events": [
                  {
                    "$type": "received",
                    "message": {
                      "body": {
                        "text": "increment",
                        "type": "text",
                      },
                      "bounce": true,
                      "from": "kQAI-3FJVc_ywSuY4vq0bYrzR7S4Och4y7bTU_i5yLOB3A6P",
                      "to": "kQA0B12Z-IVBSmgGwFmKk8bfxldQ7A5Qt3PZPIV65cLwsaux",
                      "type": "internal",
                      "value": 1000000000n,
                    },
                  },
                  {
                    "$type": "processed",
                    "gasUsed": 5495n,
                  },
                ],
              },
            ]
        `);

        // Check counter
        expect(await contract.getCounter()).toEqual(1n);

        // Non-owner
        await contract.send(nonOwner, { value: toNano(1) }, "increment");
        await system.run();
        expect(track.collect()).toMatchInlineSnapshot(`
            [
              {
                "$seq": 2,
                "events": [
                  {
                    "$type": "received",
                    "message": {
                      "body": {
                        "text": "increment",
                        "type": "text",
                      },
                      "bounce": true,
                      "from": "kQCVnZ1On-Ja4xfAfMbsq--jatb5sNnOUN421AHaXbebcCWH",
                      "to": "kQA0B12Z-IVBSmgGwFmKk8bfxldQ7A5Qt3PZPIV65cLwsaux",
                      "type": "internal",
                      "value": 1000000000n,
                    },
                  },
                  {
                    "$type": "failed",
                    "errorCode": 4429,
                    "errorMessage": "Invalid sender",
                  },
                  {
                    "$type": "sent-bounced",
                    "message": {
                      "body": {
                        "type": "empty",
                      },
                      "bounce": false,
                      "from": "kQA0B12Z-IVBSmgGwFmKk8bfxldQ7A5Qt3PZPIV65cLwsaux",
                      "to": "kQCVnZ1On-Ja4xfAfMbsq--jatb5sNnOUN421AHaXbebcCWH",
                      "type": "internal",
                      "value": 994873000n,
                    },
                  },
                ],
              },
            ]
        `);
    });
});
