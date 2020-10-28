import { assert } from "chai";
import { mainModule } from "process";
import { loop } from "../../src/main";
import { Game, Memory, SS } from "./mock"
import { MockRoleManager, RoleManager } from "rolemanager";
import { CreepSpawner } from "spawner";
import { MockScreepsWorld, ScreepsWorld, SequentialIdGenerator } from "screeps";
import { MiningAdviser } from "brain";
import { InMemoryJobManager, Job, JobManager } from "role/jobmanager";
import { MinerJob } from "role/job.miner";

describe("mining advistor", () => {
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

  it("create miner job", () => {
    world.add_source("s1");

    brain.run();

    let job = new MinerJob('miner-s1');
    job.type = "MINE";
    job.target = "s1";

    assert.lengthOf(jobManager.jobs(), 1);
    assert.deepInclude(jobManager.jobs(), job);
  });

  it("create miner jobs", () => {
    world.add_source('s2');
    world.add_source('s3');

    brain.run();

    let job = new MinerJob('miner-s2');
    job.type = "MINE";
    job.target = "s2";

    let job2 = new MinerJob('miner-s3');
    job2.type = "MINE";
    job2.target = "s3";

    assert.deepInclude(jobManager.jobs(), job);
    assert.deepInclude(jobManager.jobs(), job2);
  });

  it("old job is saved", () => {
    world.add_source("s1");

    let job2 = new MinerJob('miner-s1');
    job2.type = "MINE";
    job2.target = "s1";
    job2.miner = "miner-1";
    jobManager.add(job2);

    brain.run();

    let job = new MinerJob('miner-s1');
    job.type = "MINE";
    job.target = "s1";

    assert.lengthOf(jobManager.jobs(), 1);
    assert.deepInclude(jobManager.jobs(), job2);
  });
});
