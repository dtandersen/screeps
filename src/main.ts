import { ErrorMapper } from "utils/ErrorMapper";
import { Harvester } from "role/harvest";
import { Upgrader } from "role/upgrader";
import { InMemoryRoleManager, RoleManager } from "role/rolemanager";
import { RandomIdGenerator, ScreepsScreepsWorld, SequentialIdGenerator } from "screeps";
import { CreepSpawner } from "spawner";
import { MiningAdviser } from "adviser/mining.adviser";
import { CommandFactory } from "job/command";
import { InMemoryJobManager, ScreepsJobManager } from "role/jobmanager";
import { JobDeployer as JobRunner } from "job/job";
import { MiningJobHandler } from "job/mining";
import { RoleRunner } from "role/runner";
import { ScreepRoleContext } from "role/role";
import { CreepEntity, ScreepsCreepEntity } from "entity/creep";
import { Miner } from "role/miner";
import { log } from "memory";
import { ScreepsPathFinder } from "pathjgen";
import { InMemoryConstructionManager } from "role/construction.manager";
import { LayoutJobHandler } from "job/layout.job";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  log(`=== TICK ${Game.time} ===`);

  cleanMemory();

  let jobManager = new ScreepsJobManager();
  let world = new ScreepsScreepsWorld();
  let constructionManager = new InMemoryConstructionManager();
  let pathFinder = new ScreepsPathFinder();
  let factory = new CommandFactory({
    world: world,
    jobManager: jobManager,
    constructionManager: constructionManager,
    pathFinder: pathFinder
  });
  let adviser = factory.miningAdviser();
  adviser.run();

  let roadAdviser = factory.roadAdviser();
  roadAdviser.run();

  let jobRunner = new JobRunner(jobManager);
  jobRunner.addHandler('MINE', new MiningJobHandler(world, jobManager));
  jobRunner.addHandler('layout', new LayoutJobHandler(world, jobManager));
  jobRunner.run();

  spawnCreeps();

  let roleManager = new InMemoryRoleManager();
  roleManager.add_role(new Harvester());
  roleManager.add_role(new Upgrader());
  roleManager.add_role(new Miner(world));

  let roleRunner = new RoleRunner(world, roleManager);
  roleRunner.run();
});

// Automatically delete memory of missing creeps
function cleanMemory() {
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
}

// module main {
function spawnCreeps() {
  let screeps = new ScreepsScreepsWorld();
  let roleManager = new InMemoryRoleManager();
  let spawner = new CreepSpawner(roleManager, screeps, new RandomIdGenerator());

  spawner.spawn();
}
