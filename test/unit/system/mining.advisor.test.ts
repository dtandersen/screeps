import { assert } from "chai";
import { mainModule } from "process";
import { loop } from "../../../src/main";
import { Game, Memory, SS } from "../mock"
import { InMemoryRoleManager, RoleManager } from "gateway/role.manager";
import { CreepSpawner } from "system/spawner";
import { MockScreepsWorld, ScreepsWorld, SequentialIdGenerator } from "gateway/screeps";
import { MiningAdviser } from "system/mining.adviser";
import { InMemoryJobManager, Job, JobManager } from "gateway/job.manager";
import { MiningJob } from "job/mining";

describe("mining adviser", () => {
  var brain: MiningAdviser;
  var world: MockScreepsWorld;
  var jobManager: JobManager;

  before(() => {
  });

  beforeEach(() => {
    world = new MockScreepsWorld();
    jobManager = new InMemoryJobManager();
    brain = new MiningAdviser(world, jobManager);
  });

  it("create a mining job for the source", () => {
    world.add_source("s1", 1, 1);

    brain.run();

    let job = new MiningJob('mining-job-s1', 'miner-s1', 1, 1);
    job.type = "MINE";
    job.source_id = "s1";
    // job.x = 1;
    // job.y = 1;

    assert.lengthOf(jobManager.jobs(), 1);
    assert.deepInclude(jobManager.jobs(), job);
  });

  it("create a mining job for each source", () => {
    world.add_source('s2', 2, 2);
    world.add_source('s3', 3, 3);

    brain.run();

    let job = new MiningJob('mining-job-s2', 'miner-s2', 2, 2);
    job.type = "MINE";
    job.source_id = "s2";

    let job2 = new MiningJob('mining-job-s3', 'miner-s3', 3, 3);
    job2.type = "MINE";
    job2.source_id = "s3";

    assert.deepInclude(jobManager.jobs(), job);
    assert.deepInclude(jobManager.jobs(), job2);
  });

  it("old mining job is saved", () => {
    world.add_source("s1", 1, 1);

    let job2 = new MiningJob('mining-job-s1', 'miner-1', 1, 1);
    job2.type = "MINE";
    job2.source_id = "s1";
    job2.miner_creep_name = "miner-1";
    jobManager.add(job2);

    brain.run();

    let job = new MiningJob('mining-job-s1', 'miner-1', 1, 1);
    job.type = "MINE";
    job.source_id = "s1";

    assert.lengthOf(jobManager.jobs(), 1);
    assert.deepInclude(jobManager.jobs(), job2);
  });
});
