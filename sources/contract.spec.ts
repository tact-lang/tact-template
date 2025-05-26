import { testContract } from "./contract";
import { SampleTactContract } from "./output/sample_SampleTactContract";

describe("SampleTactContract", () => {
    testContract(SampleTactContract.fromInit.bind(SampleTactContract));
});
