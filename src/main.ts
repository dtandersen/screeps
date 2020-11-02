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
import { SystemRunner } from "system/system.runner";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  log(`=== TICK ${Game.time} ===`);

  cleanMemory();

  let jobManager = new ScreepsJobManager();
  let world = new ScreepsScreepsWorld();
  let constructionManager = new InMemoryConstructionManager();
  let pathFinder = new ScreepsPathFinder();
  let roleManager = new InMemoryRoleManager();
  let factory = new CommandFactory({
    world: world,
    jobManager: jobManager,
    constructionManager: constructionManager,
    pathFinder: pathFinder,
    roleManager: roleManager
  });

  let systemRunner = new SystemRunner();

  let jobRunner = factory.jobRunner();
  jobRunner.addHandler('MINE', new MiningJobHandler(world, jobManager));
  jobRunner.addHandler('layout', new LayoutJobHandler(world, jobManager));

  roleManager.add_role(new Harvester());
  roleManager.add_role(new Upgrader());
  roleManager.add_role(new Miner(world));

  systemRunner.registerSystem(factory.miningAdviser());
  systemRunner.registerSystem(factory.roadAdviser());
  systemRunner.registerSystem(jobRunner);
  systemRunner.registerSystem(factory.creepSpawner());
  systemRunner.registerSystem(factory.roleRunner());

  systemRunner.run();
});

// Automatically delete memory of missing creeps
function cleanMemory() {
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
}
