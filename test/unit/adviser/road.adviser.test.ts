import { assert } from "chai";
import { MockScreepsWorld, ScreepsWorld, SequentialIdGenerator } from "screeps";
import { InMemoryConstructionManager } from "role/construction.manager";
import { RoadAdviser as RoadAdviser } from "adviser/road.adviser";
import { RoomElement, RoomLayout } from "entity/layout";
import { MockPathGenerator } from "pathjgen";
import { Position } from "entity/creep";
import { InMemoryJobManager } from "role/jobmanager";
import { LayoutJob } from "job/layout.job";

describe("extension adviser", () => {
  var adviser: RoadAdviser;
  var world: MockScreepsWorld;
  var constructionManager: InMemoryConstructionManager;
  var jobManager: InMemoryJobManager;
  var pathFinder: MockPathGenerator;

  before(() => {
  });

  beforeEach(() => {
    world = new MockScreepsWorld();
    constructionManager = new InMemoryConstructionManager();
    jobManager = new InMemoryJobManager();
    pathFinder = new MockPathGenerator();
    adviser = new RoadAdviser(world, constructionManager, jobManager, pathFinder);
  });

  /**
   *    x --->
   *    1234
   * y 1srrs
   * | 2
   * | 3
   * v 4
   */
  it("build road from spawn to source in r1", () => {
    world.add_spawn('Spawn1', 300, 'r1', 1, 4)
    world.add_source("s1", 1, 1);

    pathFinder.add(new Position(1, 4, 'r1'), new Position(1, 1, 'r1'), [
      new Position(2, 1, 'r1'),
      new Position(3, 1, 'r1')
    ]);

    adviser.run();

    let layout = constructionManager.layout('r1')!;
    assert.deepEqual(layout.get(2, 1), new RoomElement(2, 1, 'road'));
    assert.deepEqual(layout.get(3, 1), new RoomElement(3, 1, 'road'));

    let job = jobManager.find('layout-r1');
    assert.deepEqual(job, new LayoutJob({
      id: 'layout-r1',
      layout: new RoomLayout({
        elements: {
          '2,1': {
            x: 2,
            y: 1,
            structure: 'road'
          },
          '3,1': {
            x: 3,
            y: 1,
            structure: 'road'
          }
        }
      })
    }));
  });

  /**
   *    x --->
   *    1234
   * y 1 s
   * | 2 r
   * | 3 r
   * v 4 s
   */
  it("build road from spawn to source in r2", () => {
    world.add_spawn('Spawn1', 300, 'r2', 2, 1)
    world.add_source("s1", 2, 4);

    pathFinder.add(new Position(2, 1, 'r2'), new Position(2, 4, 'r2'), [
      new Position(2, 2, 'r2'),
      new Position(2, 3, 'r2')
    ]);

    adviser.run();

    let layout = constructionManager.layout('r2')!;
    assert.deepEqual(layout.get(2, 2), new RoomElement(2, 2, 'road'));
    assert.deepEqual(layout.get(2, 3), new RoomElement(2, 3, 'road'));

    let job = jobManager.find('layout-r2');
    assert.deepEqual(job, new LayoutJob({
      id: 'layout-r2',
      layout: new RoomLayout({
        elements: {
          '2,2': {
            x: 2,
            y: 2,
            structure: 'road'
          },
          '2,3': {
            x: 2,
            y: 3,
            structure: 'road'
          }
        }
      })
    }));
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

    pathFinder.add(new Position(1, 1, 'r2'), new Position(3, 1, 'r2'), [
      new Position(2, 1, 'r2')
    ]);

    pathFinder.add(new Position(1, 1, 'r2'), new Position(1, 3, 'r2'), [
      new Position(1, 2, 'r2')
    ]);

    adviser.run();

    let layout = constructionManager.layout('r2')!;
    assert.deepEqual(layout.get(2, 1), new RoomElement(2, 1, 'road'));
    assert.deepEqual(layout.get(1, 2), new RoomElement(1, 2, 'road'));

    let job = jobManager.find('layout-r2');
    assert.deepEqual(job, new LayoutJob({
      id: 'layout-r2',
      layout: new RoomLayout({
        elements: {
          '2,1': {
            x: 2,
            y: 1,
            structure: 'road'
          },
          '1,2': {
            x: 1,
            y: 2,
            structure: 'road'
          }
        }
      })
    }));
  });
});
