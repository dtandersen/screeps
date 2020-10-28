import { assert } from "chai";
import { mainModule } from "process";
import { loop } from "../../src/main";
import { Game, Memory, SS } from "./mock"
import { InMemoryRoleManager, RoleManager } from "role/rolemanager";
import { CreepSpawner } from "spawner";
import { MockScreepsWorld, ScreepsWorld, SequentialIdGenerator } from "screeps";

describe("spawn test", () => {
  before(() => {
    // runs before all test in this block
  });

  beforeEach(() => {
  });

  it("should spawn harvester when energy below 300", () => {
    let screeps = new MockScreepsWorld();
    // screeps.add_creep("h1", 'harvester');
    screeps.add_creep("u1", 'upgrader');
    screeps.add_creep("u2", 'upgrader');
    screeps.add_creep("u3", 'upgrader');
    screeps.add_spawn('Spawn1', 299);
    let roleManager = new InMemoryRoleManager();
    let spawner = new CreepSpawner(roleManager, screeps, new SequentialIdGenerator);

    spawner.spawn();

    assert.equal(screeps.limit('harvester'), 2);
    assert.equal(screeps.limit('upgrader'), 4);
    assert.deepInclude(screeps.spawned, {
      name: 'harvester-1',
      role: 'harvester'
    });
  });

  it("should spawn nothing", () => {
    let screeps = new MockScreepsWorld();
    screeps.add_creep("h2", 'harvester');
    screeps.add_creep("u1", 'upgrader');
    screeps.add_creep("u2", 'upgrader');
    screeps.add_creep("u3", 'upgrader');
    screeps.add_creep("u4", 'upgrader');
    screeps.add_creep("u5", 'upgrader');
    screeps.add_creep("u6", 'upgrader');
    screeps.add_creep("u7", 'upgrader');
    screeps.add_creep("u8", 'upgrader');
    screeps.add_creep("u9", 'upgrader');
    screeps.add_creep("u10", 'upgrader');
    let roleManager = new InMemoryRoleManager();
    let spawner = new CreepSpawner(roleManager, screeps, new SequentialIdGenerator);

    spawner.spawn();

    assert.equal(screeps.limit('harvester'), 2);
    assert.equal(screeps.limit('upgrader'), 4);
    assert.isEmpty(screeps.spawned);
  });
});
