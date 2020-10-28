import { assert } from "chai";
import { mainModule } from "process";
import { loop } from "../../../src/main";
import { Game, Memory, SS } from "../mock"
import { InMemoryRoleManager, RoleManager } from "role/rolemanager";
import { CreepSpawner } from "spawner";
import { MockScreepsWorld, ScreepsWorld, SequentialIdGenerator } from "screeps";
import { MiningAdviser } from "adviser/mining.adviser";
import { InMemoryJobManager, Job, JobManager } from "role/jobmanager";
import { MiningJob, MiningJobHandler } from "job/job.miner";
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
    let job_deployer = new JobDeployer(jobManager, handler);

    let job = new MiningJob('mining-job-s1', 'miner-s1');
    job.type = "MINE";
    job.source_id = "s1";
    job.miner_creep_name = 'miner-s1';
    jobManager.add(job);

    job_deployer.run();

    assert.lengthOf(world.spawned, 1);
    assert.deepInclude(world.spawned, {
      name: 'miner-s1',
      role: 'miner'
    });
  });
});
