import { assert } from "chai";
import { mainModule } from "process";
import { loop } from "../../src/main";
import { Game, Memory, SS } from "./mock"
import { InMemoryRoleManager, RoleManager } from "role/rolemanager";
import { CreepSpawner } from "spawner";
import { MockScreepsWorld, ScreepsWorld, SequentialIdGenerator, SpawnRequest } from "screeps";

describe("spawn test", () => {
  before(() => {
    // runs before all test in this block
  });

  beforeEach(() => {
  });

  it("should spawn harvester when energy below 300", () => {
    let screeps = new MockScreepsWorld();
    // screeps.add_creep("h1", 'harvester');
    screeps.add_creep("u1", { role: 'upgrader' }, 1, 1, 'r1');
    screeps.add_creep("u2", { role: 'upgrader' }, 2, 2, 'r1');
    screeps.add_creep("u3", { role: 'upgrader' }, 3, 3, 'r1');
    screeps.add_spawn('Spawn1', 299, 'r1', 7, 7);
    let roleManager = new InMemoryRoleManager();
    let spawner = new CreepSpawner(roleManager, screeps, new SequentialIdGenerator);

    spawner.run();

    assert.equal(screeps.limit('harvester'), 2);
    assert.equal(screeps.limit('upgrader'), 4);
    assert.deepInclude(screeps.spawned, {
      name: 'harvester-1',
      body: ["work", "carry", "move"],
      memory: {
        role: 'harvester',
        working: true,
        room: 'r1'
      }
    });
  });

  it("should spawn upgrader when energy below 300", () => {
    let screeps = new MockScreepsWorld();
    screeps.add_creep("h2", { role: 'harvester' }, 4, 4, 'r1');
    screeps.add_creep("u1", { role: 'upgrader' }, 1, 1, 'r1');
    screeps.add_creep("u2", { role: 'upgrader' }, 2, 2, 'r1');
    screeps.add_creep("u3", { role: 'upgrader' }, 3, 3, 'r1');
    // screeps.add_creep("u4", 'upgrader');
    // screeps.add_creep("u5", 'upgrader');
    // screeps.add_creep("u6", 'upgrader');
    // screeps.add_creep("u7", 'upgrader');
    // screeps.add_creep("u8", 'upgrader');
    // screeps.add_creep("u9", 'upgrader');
    screeps.add_spawn('Spawn1', 299, 'room2', 8, 8);
    let roleManager = new InMemoryRoleManager();
    let spawner = new CreepSpawner(roleManager, screeps, new SequentialIdGenerator);

    spawner.run();

    assert.deepInclude(screeps.spawned, {
      name: 'upgrader-1',
      body: ["work", "carry", "move"],
      memory: {
        role: 'upgrader',
        working: true,
        room: 'room2'
      }
    });
  });

  it("should spawn nothing", () => {
    let screeps = new MockScreepsWorld();
    screeps.add_creep("h2", { role: 'harvester' }, 4, 4, 'r1');
    screeps.add_creep("u1", { role: 'upgrader' }, 4, 4, 'r1');
    screeps.add_creep("u2", { role: 'upgrader' }, 4, 4, 'r1');
    screeps.add_creep("u3", { role: 'upgrader' }, 4, 4, 'r1');
    screeps.add_creep("u4", { role: 'upgrader' }, 4, 4, 'r1');
    screeps.add_creep("u5", { role: 'upgrader' }, 4, 4, 'r1');
    screeps.add_creep("u6", { role: 'upgrader' }, 4, 4, 'r1');
    screeps.add_creep("u7", { role: 'upgrader' }, 4, 4, 'r1');
    screeps.add_creep("u8", { role: 'upgrader' }, 4, 4, 'r1');
    screeps.add_creep("u9", { role: 'upgrader' }, 4, 4, 'r1');
    screeps.add_creep("u10", { role: 'upgrader' }, 4, 4, 'r1');
    let roleManager = new InMemoryRoleManager();
    let spawner = new CreepSpawner(roleManager, screeps, new SequentialIdGenerator);

    spawner.run();

    assert.equal(screeps.limit('harvester'), 2);
    assert.equal(screeps.limit('upgrader'), 4);
    assert.isEmpty(screeps.spawned);
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
