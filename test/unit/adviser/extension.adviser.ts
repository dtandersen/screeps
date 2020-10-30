import { assert } from "chai";
import { mainModule } from "process";
import { loop } from "../../../src/main";
import { Game, Memory, SS } from "../mock"
import { InMemoryRoleManager, RoleManager } from "role/rolemanager";
import { CreepSpawner } from "spawner";
import { MockScreepsWorld, ScreepsWorld, SequentialIdGenerator } from "screeps";
import { MiningAdviser } from "adviser/mining.adviser";
import { InMemoryJobManager, Job, JobManager } from "role/jobmanager";
import { MiningJob } from "job/mining";
import { InMemoryConstructionManager } from "role/construction.manager";
import { ExtensionAdviser } from "adviser/construction.adviser";
import { RoomElement } from "entity/layout";
import { MockPathGenerator } from "pathjgen";
import { Position } from "entity/creep";

describe("extension adviser", () => {
  var adviser: ExtensionAdviser;
  var world: MockScreepsWorld;
  var constructionManager: InMemoryConstructionManager;
  var pathFinder: MockPathGenerator;

  before(() => {
  });

  beforeEach(() => {
    world = new MockScreepsWorld();
    constructionManager = new InMemoryConstructionManager();
    pathFinder = new MockPathGenerator();
    adviser = new ExtensionAdviser(world, constructionManager, pathFinder);
  });

  /**
   *    x --->
   *    1234
   * y 1srrs
   * | 2
   * | 3
   * v 4
   */
  it("build road from spawn to source", () => {
    world.add_spawn('Spawn1', 300, 'r1', 1, 4)
    world.add_source("s1", 1, 1);

    pathFinder.add(new Position(1, 4), new Position(1, 1), [
      new Position(2, 1),
      new Position(3, 1)
    ]);

    adviser.run();

    let layout = constructionManager.layout('r1')!;
    assert.deepEqual(layout.get(2, 1), new RoomElement('road'));
    assert.deepEqual(layout.get(3, 1), new RoomElement('road'));
  });

  /**
   *    x --->
   *    1234
   * y 1 s
   * | 2 r
   * | 3 r
   * v 4 s
   */
  it("build road from spawn to source", () => {
    world.add_spawn('Spawn1', 300, 'r2', 2, 1)
    world.add_source("s1", 2, 4);

    pathFinder.add(new Position(2, 1), new Position(2, 4), [
      new Position(2, 2),
      new Position(2, 3)
    ]);

    adviser.run();

    let layout = constructionManager.layout('r2')!;
    assert.deepEqual(layout.get(2, 2), new RoomElement('road'));
    assert.deepEqual(layout.get(2, 3), new RoomElement('road'));
  });

  /**
   *    x --->
   *    123
   * y 1Srs
   * | 2r
   * | 3s
   */
  it("build road from spawn to both sources", () => {
    world.add_spawn('Spawn1', 300, 'r2', 1, 1)
    world.add_source("s1", 3, 1);
    world.add_source("s2", 1, 3);

    pathFinder.add(new Position(1, 1), new Position(3, 1), [
      new Position(2, 1)
    ]);

    pathFinder.add(new Position(1, 1), new Position(1, 3), [
      new Position(1, 2)
    ]);

    adviser.run();

    let layout = constructionManager.layout('r2')!;
    assert.deepEqual(layout.get(2, 1), new RoomElement('road'));
    assert.deepEqual(layout.get(1, 2), new RoomElement('road'));
  });
});
