import { assert } from "chai";
import { InMemoryRoleManager } from "gateway/role.manager";
import { CreepSpawner } from "system/spawner";
import { MockScreepsWorld, SequentialIdGenerator, SpawnRequest } from "gateway/screeps";

describe("spawn test", () => {
  before(() => {
    // runs before all test in this block
  });

  beforeEach(() => {
  });

  it("should spawn request", () => {
    let world = new MockScreepsWorld();
    let roleManager = new InMemoryRoleManager();
    let spawner = new CreepSpawner(roleManager, world, new SequentialIdGenerator);

    world.memory('requests', [new SpawnRequest(
      {
        name: 'upgrader-1',
        body: ["work", "carry", "move"],
        memory: {
          role: 'upgrader',
          working: true,
          room: 'room2'
        },
        priority: 10
      }
    )]);

    spawner.run();

    assert.deepEqual(world.spawned, [{
      name: 'upgrader-1',
      body: ["work", "carry", "move"],
      memory: {
        role: 'upgrader',
        working: true,
        room: 'room2'
      }
    }]);

    assert.isEmpty(world.memory('requests'));
  });

  it("should spawn highest priority request", () => {
    let world = new MockScreepsWorld();
    let roleManager = new InMemoryRoleManager();
    let spawner = new CreepSpawner(roleManager, world, new SequentialIdGenerator);

    world.requestSpawn(new SpawnRequest(
      {
        name: 'upgrader-1',
        body: ["work", "carry", "move"],
        memory: {
          role: 'upgrader',
          working: true,
          room: 'room2'
        },
        priority: 5
      }
    ));

    world.requestSpawn(new SpawnRequest(
      {
        name: 'miner-1',
        body: ["work", "work", "move"],
        memory: {
          role: 'miner',
          working: true,
          room: 'room2'
        },
        priority: 10
      }
    ));

    spawner.run();

    assert.deepEqual(world.spawned, [{
      name: 'miner-1',
      body: ["work", "work", "move"],
      memory: {
        role: 'miner',
        working: true,
        room: 'room2'
      }
    }]);

    assert.isEmpty(world.memory('requests'));
  });
});
