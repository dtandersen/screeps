import { assert } from "chai";
import { MockScreepsWorld, ScreepsWorld, SequentialIdGenerator, SpawnRequest } from "screeps";
import { InMemoryJobManager, Job, JobManager } from "role/jobmanager";
import { MiningJob, MiningJobHandler } from "job/mining";
import { JobDeployer } from "job/job";
import { LayoutJob, LayoutJobHandler } from "job/layout.job";
import { RoomLayout } from "entity/layout";

describe("layout job", () => {
  var world: MockScreepsWorld;
  var jobManager: JobManager;
  var handler: LayoutJobHandler;

  before(() => {
  });

  beforeEach(() => {
    world = new MockScreepsWorld();
    jobManager = new InMemoryJobManager();
    handler = new LayoutJobHandler(world, jobManager);
  });

  it("create layout creep", () => {
    world.add_spawn('Spawn1', 300, 'r1', 5, 5);
    world.add_source("0", 1, 1);
    let job_deployer = new JobDeployer(jobManager);
    job_deployer.addHandler('layout', handler);

    let job = new LayoutJob({
      id: 'layout-1',
      layout: new RoomLayout({ elements: {} })
    });
    jobManager.add(job);

    job_deployer.run();

    assert.deepEqual(world.memory('requests'), [new SpawnRequest({
      name: 'builder-r1',
      body: ['work', 'carry', 'move'],
      memory: {
        role: 'builder'
      },
      priority: 5
    })]);
  });

  it("don't overwrite other spawns", () => {
    world.add_spawn('Spawn1', 300, 'r1', 5, 5);
    world.add_source("0", 1, 1);
    let job_deployer = new JobDeployer(jobManager);
    job_deployer.addHandler('layout', handler);

    let job = new LayoutJob({
      id: 'layout-1',
      layout: new RoomLayout({ elements: {} })
    });
    jobManager.add(job);

    world.requestSpawn(new SpawnRequest({
      name: 'miner1',
      body: ['work', 'work', 'move'],
      memory: {
        role: 'miner'
      },
      priority: 10
    }));

    job_deployer.run();

    assert.deepEqual(world.memory('requests'), [
      new SpawnRequest({
        name: 'miner1',
        body: ['work', 'work', 'move'],
        memory: {
          role: 'miner'
        },
        priority: 10
      }),
      new SpawnRequest({
        name: 'builder-r1',
        body: ['work', 'carry', 'move'],
        memory: {
          role: 'builder'
        },
        priority: 5
      })]);
  });

  it("don't spawn layout creep if exists", () => {
    world.add_spawn('Spawn1', 300, 'r2', 5, 5);
    world.add_creep('builder-r2', {}, 1, 1, 'r2');
    // world.add_source("0", 1, 1);
    let job_deployer = new JobDeployer(jobManager);
    job_deployer.addHandler('layout', handler);

    let job = new LayoutJob({
      id: 'layout-1',
      layout: new RoomLayout({ elements: {} })
    });
    jobManager.add(job);

    job_deployer.run();

    assert.isUndefined(world.memory('requests'));
  });
});
