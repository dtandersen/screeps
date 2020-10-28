import { assert } from "chai";
import { mainModule } from "process";
import { loop } from "../../../src/main";
import { Game, Memory, SS } from "../mock"
import { InMemoryRoleManager, RoleManager } from "role/rolemanager";
import { CreepSpawner } from "spawner";
import { MockScreepsWorld, ScreepsWorld, SequentialIdGenerator } from "screeps";
import { Role, RoleContext, ScreepRoleContext } from "role/role";
import { RoleRunner } from "role/runner";

describe("role runner", () => {
  before(() => {
    // runs before all test in this block
  });

  beforeEach(() => {
  });

  it("should execute role on creep", () => {
    let world = new MockScreepsWorld();
    world.add_creep("u1", 'role1', { role: 'role1' });
    world.add_creep("u2", 'role2', { role: 'role2' });

    let role1 = new MockRole("role1");
    let role2 = new MockRole("role2");
    let roleManager = new InMemoryRoleManager();
    roleManager.add_role(role1);
    roleManager.add_role(role2);

    let roleRunner = new RoleRunner(world, roleManager);

    roleRunner.run();

    assert.isTrue(role1.executed);
    assert.isTrue(role2.executed);

    assert.deepInclude(role1.contexts,
      new ScreepRoleContext({ memory: { role: 'role1' } },
        world.findCreep("u1"))
    );

    assert.deepInclude(role2.contexts,
      new ScreepRoleContext({ memory: { role: 'role2' } },
        world.findCreep("u2"))
    );
  });
});

class MockRole extends Role {
  executed: boolean = false;
  contexts: RoleContext[] = [];

  execute(context: RoleContext): void {
    this.executed = true;
    this.contexts.push(context);
  }
}
