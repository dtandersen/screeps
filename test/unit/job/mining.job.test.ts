import { assert } from "chai";
import { mainModule } from "process";
import { loop } from "../../../src/main";
import { Game, Memory, SS } from "../mock"
import { InMemoryRoleManager, RoleManager } from "role/rolemanager";
import { CreepSpawner } from "spawner";
import { MockScreepsWorld, ScreepsWorld, SequentialIdGenerator } from "screeps";
import { MiningAdviser } from "adviser/mining.adviser";
import { InMemoryJobManager, Job, JobManager } from "role/jobmanager";
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
    let job_deployer = new JobDeployer(jobManager, handler);

    let job = new MiningJob('mining-job-0', 'miner-0', 1, 1);
    job.type = "MINE";
    job.source_id = "0";
    job.miner_creep_name = 'miner-0';
    jobManager.add(job);

    job_deployer.run();

    assert.lengthOf(world.spawned, 1);
    assert.deepInclude(world.spawned, {
      name: 'miner-0',
      role: 'miner',
      memory: {
        role: 'miner',
        x: 1,
        y: 1,
        working: true,
        room: 'r1',
        sourceId: '0'
      }
    });
  });

  it("create another miner creep", () => {
    world.add_spawn('Spawn1', 300, 'r2', 6, 6);
    world.add_source("1", 2, 2);
    let job_deployer = new JobDeployer(jobManager, handler);

    let job = new MiningJob('mining-job-1', 'miner-1', 1, 1);
    job.type = "MINE";
    job.source_id = "1";
    job.miner_creep_name = 'miner-1';
    jobManager.add(job);

    job_deployer.run();

    assert.lengthOf(world.spawned, 1);
    assert.deepInclude(world.spawned, {
      name: 'miner-1',
      role: 'miner',
      memory: {
        role: 'miner',
        x: 2,
        y: 2,
        working: true,
        room: 'r2',
        sourceId: '1'
      }
    });
  });
});
