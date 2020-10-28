import { assert } from "chai";
import { mainModule } from "process";
import { loop } from "../../../src/main";
import { Game, Memory, SS } from "../mock"
import { InMemoryRoleManager, RoleManager } from "role/rolemanager";
import { CreepSpawner } from "spawner";
import { MockScreepsWorld, ScreepsWorld, SequentialIdGenerator } from "screeps";
import { Miner } from "role/miner";
import { RoleRunner } from "role/runner";
import { Role, RoleContext } from "role/role";
import { MockCreepEntity, Position } from "entity/creep";

describe("mining creep", () => {
  before(() => {
    // runs before all test in this block
  });

  beforeEach(() => {
  });

  it("should move creep to 1,1", () => {
    let world = new MockScreepsWorld();
    world.add_creep("miner-1", 'miner', { role: 'miner', x: 1, y: 1 });
    // world.add_source("0", 1, 1);
    let role = new Miner();
    let roleManager = new InMemoryRoleManager();
    roleManager.add_role(role);

    let roleRunner = new RoleRunner(world, roleManager);
    roleRunner.run();

    let creep: MockCreepEntity = world.findCreep('miner-1');

    assert.deepEqual(creep.movedTo, new Position(1, 1));
  });

  it("should move creep to 2, 2", () => {
    let world = new MockScreepsWorld();
    world.add_creep("miner-1", 'miner', { role: 'miner', x: 2, y: 2 });
    // world.add_source("0", 1, 1);
    let role = new Miner();
    let roleManager = new InMemoryRoleManager();
    roleManager.add_role(role);

    let roleRunner = new RoleRunner(world, roleManager);
    roleRunner.run();

    let creep: MockCreepEntity = world.findCreep('miner-1');

    assert.deepEqual(creep.movedTo, new Position(2, 2));
  });
})
