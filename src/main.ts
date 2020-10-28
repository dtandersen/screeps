import { ErrorMapper } from "utils/ErrorMapper";
import { Harvester } from "role/harvest";
import { Upgrader } from "role/upgrader";
import { MockRoleManager, RoleManager } from "rolemanager";
import { RandomIdGenerator, ScreepsScreepsWorld, SequentialIdGenerator } from "screeps";
import { CreepSpawner } from "spawner";
import { MiningAdviser } from "brain";
import { CommandFactory } from "command";
import { InMemoryJobManager, ScreepsJobManager } from "role/jobmanager";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);
  let jobManager = new ScreepsJobManager();
  let factory = new CommandFactory({
    world: new ScreepsScreepsWorld(),
    jobManager: jobManager
  });
  let adviser = factory.miningAdviser();
  adviser.run();
  let screeps = new ScreepsScreepsWorld()
  cleanMemory();
  spawnCreeps2();
  applyRole(new Harvester(), "harvester");
  applyRole(new Upgrader(), "upgrader");
});

function role(role: string): Creep[] {
  let results: Creep[] = [];

  for (const name in Memory.creeps) {
    let mem: CreepMemory = Memory.creeps[name];
    let r = mem["role"];
    if (r === role) {
      results.push(Game.creeps[name]);
    }
  }

  return results;
}

function applyRole(role: Harvester, roleName: string) {
  for (const name in Memory.creeps) {
    // console.log(name);
    let r = Memory.creeps[name].role;
    if (r === roleName) {
      role.execute(Game.creeps[name]);
    }
  }
}

// Automatically delete memory of missing creeps
function cleanMemory() {
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
}

// module main {
function spawnCreeps2() {
  let screeps = new ScreepsScreepsWorld();
  let roleManager = new MockRoleManager();
  let spawner = new CreepSpawner(roleManager, screeps, new RandomIdGenerator());

  spawner.spawn();
}
