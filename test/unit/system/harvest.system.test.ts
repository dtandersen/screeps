import { assert } from "chai";
import { InMemoryRoleManager } from "gateway/role.manager";
import { CreepSpawner } from "system/spawner";
import { MockScreepsWorld, SequentialIdGenerator, SpawnRequest } from "gateway/screeps";
import { UpgradeSystem } from "system/upgrade.system";
import { HarvestSystem } from "system/harvest.system";

describe("spawn test", () => {
  before(() => {
    // runs before all test in this block
  });

  beforeEach(() => {
  });

  it("should spawn harvester when less than 2", () => {
    let screeps = new MockScreepsWorld();
    screeps.add_spawn('Spawn1', 300, 'room1', 1, 1);

    for (let i = 1; i <= 1; i++) {
      screeps.add_creep(`harvester-${i}`, { role: 'harvester' }, 1, 1, 'room1');
    }

    let idGenerator = new SequentialIdGenerator();
    idGenerator.next_id();
    let system = new HarvestSystem(screeps, idGenerator);

    system.run();

    assert.deepEqual(screeps.spawnRequests(), [
      new SpawnRequest({
        name: 'harvester-2',
        body: ["work", "carry", "move"],
        memory: {
          role: 'harvester',
          working: true,
          room: 'room1'
        },
        priority: 9
      })
    ]);
  });

  it("should spawn harvester when less than 2 another room", () => {
    let screeps = new MockScreepsWorld();
    screeps.add_spawn('Spawn1', 300, 'room2', 1, 1);

    let system = new HarvestSystem(screeps, new SequentialIdGenerator());

    system.run();

    assert.deepEqual(screeps.spawnRequests(), [
      new SpawnRequest({
        name: 'harvester-1',
        body: ["work", "carry", "move"],
        memory: {
          role: 'harvester',
          working: true,
          room: 'room2'
        },
        priority: 9
      })
    ]);
  });

  it("don't spawn harvester if there are 2", () => {
    let screeps = new MockScreepsWorld();
    for (let i = 1; i <= 2; i++) {
      screeps.add_creep(`harvester-${i}`, { role: 'harvester' }, 1, 1, 'r1');
    }

    let system = new HarvestSystem(screeps, new SequentialIdGenerator());

    system.run();

    assert.isUndefined(screeps.spawnRequests());
  });
});
