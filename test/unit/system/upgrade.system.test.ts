import { assert } from "chai";
import { InMemoryRoleManager } from "gateway/role.manager";
import { CreepSpawner } from "system/spawner";
import { MockScreepsWorld, SequentialIdGenerator, SpawnRequest } from "gateway/screeps";
import { UpgradeSystem } from "system/upgrade.system";

describe("spawn test", () => {
  before(() => {
    // runs before all test in this block
  });

  beforeEach(() => {
  });

  it("should spawn upgrader when less than 10", () => {
    let screeps = new MockScreepsWorld();
    let idGenerator = new SequentialIdGenerator();
    screeps.add_spawn('Spawn1', 300, 'room1', 1, 1);
    for (let i = 1; i <= 9; i++) {
      let id = idGenerator.next_id();
      screeps.add_creep(`upgrader-${id}`, { role: 'upgrader' }, 1, 1, 'room1');
    }

    let system = new UpgradeSystem(screeps, idGenerator);

    system.run();

    assert.deepEqual(screeps.spawnRequests(), [
      new SpawnRequest({
        name: 'upgrader-10',
        body: ["work", "carry", "move"],
        memory: {
          role: 'upgrader',
          working: true,
          room: 'room1'
        },
        priority: 1
      })
    ]);
  });

  it("should spawn upgrader when less than 10 another room", () => {
    let screeps = new MockScreepsWorld();
    screeps.add_spawn('Spawn1', 300, 'room2', 1, 1);

    let system = new UpgradeSystem(screeps, new SequentialIdGenerator());

    system.run();

    assert.deepEqual(screeps.spawnRequests(), [
      new SpawnRequest({
        name: 'upgrader-1',
        body: ["work", "carry", "move"],
        memory: {
          role: 'upgrader',
          working: true,
          room: 'room2'
        },
        priority: 1
      })
    ]);
  });

  it("don't spawn upgrader if there are 10", () => {
    let screeps = new MockScreepsWorld();
    for (let i = 1; i <= 10; i++) {
      screeps.add_creep(`upgrader-${i}`, { role: 'upgrader' }, 1, 1, 'r1');
    }

    let system = new UpgradeSystem(screeps, new SequentialIdGenerator());

    system.run();

    assert.isUndefined(screeps.spawnRequests());
  });
});
