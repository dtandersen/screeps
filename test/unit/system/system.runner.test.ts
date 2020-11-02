import { assert } from "chai";
import { System, SystemRunner } from "system/system.runner";

describe("system runner", () => {
    before(() => {
        // runs before all test in this block
    });

    beforeEach(() => {
    });

    it("should run each system", () => {
        let runner = new SystemRunner();

        let system1 = new MockSystem();
        let system2 = new MockSystem();
        runner.registerSystem(system1);
        runner.registerSystem(system2);

        runner.run();

        assert.isTrue(system1.executed);
        assert.isTrue(system2.executed);
    });
});

class MockSystem implements System {
    executed: boolean = false;

    run(): void {
        this.executed = true;
    }
}
