import { assert } from "chai";
import { MockScreepsWorld, SpawnRequest } from "gateway/screeps";
import { InMemoryJobManager, Job, JobManager } from "gateway/job.manager";
import { MiningJob, MiningJobHandler } from "job/mining";
import { JobDeployer } from "job/job";

describe("mining job", () => {
  var world: MockScreepsWorld;
  var jobManager: JobManager;
  var handler: MiningJobHandler;

  before(() => {
  });

  beforeEach(() => {
    world = new MockScreepsWorld();
    jobManager = new InMemoryJobManager();
    handler = new MiningJobHandler(world, jobManager);
  });

  it("create miner creep", () => {
    world.add_spawn('Spawn1', 300, 'r1', 5, 5);
    world.add_source("0", 1, 1);
    let job_deployer = new JobDeployer(jobManager);
    job_deployer.addHandler('MINE', handler);

    let job = new MiningJob('mining-job-0', 'miner-0', 1, 1);
    job.type = "MINE";
    job.source_id = "0";
    job.miner_creep_name = 'miner-0';
    jobManager.add(job);

    job_deployer.run();

    assert.deepEqual(world.memory('requests'), [new SpawnRequest({
      name: 'miner-0',
      body: ['work', 'work', 'move'],
      memory: {
        role: 'miner',
        x: 1,
        y: 1,
        working: true,
        room: 'r1',
        sourceId: '0'
      },
      priority: 10
    })]);
  });

  it("create another miner creep", () => {
    world.add_spawn('Spawn1', 300, 'r2', 6, 6);
    world.add_source("1", 2, 2);
    let job_deployer = new JobDeployer(jobManager);
    job_deployer.addHandler('MINE', handler);

    let job = new MiningJob('mining-job-1', 'miner-1', 1, 1);
    job.type = "MINE";
    job.source_id = "1";
    job.miner_creep_name = 'miner-1';
    jobManager.add(job);

    job_deployer.run();

    assert.deepEqual(world.memory('requests'), [new SpawnRequest({
      name: 'miner-1',
      body: ['work', 'work', 'move'],
      memory: {
        role: 'miner',
        x: 2,
        y: 2,
        working: true,
        room: 'r2',
        sourceId: '1'
      },
      priority: 10
    })]);
  });

  it("don't spawn if miner exists", () => {
    world.add_spawn('Spawn1', 300, 'r2', 6, 6);
    world.add_source("1", 2, 2);
    world.add_creep('miner-1', {}, 1, 1, 'r2');
    let job_deployer = new JobDeployer(jobManager);
    job_deployer.addHandler('MINE', handler);

    let job = new MiningJob('mining-job-1', 'miner-1', 1, 1);
    job.type = "MINE";
    job.source_id = "1";
    job.miner_creep_name = 'miner-1';
    jobManager.add(job);

    job_deployer.run();

    assert.isUndefined(world.memory('requests'));
  });
});
