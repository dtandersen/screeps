import { ErrorMapper } from "utils/ErrorMapper";
import { Harvester } from "role/harvest";
import { Upgrader } from "role/upgrader";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  cleanMemory();
  spawnCreeps(role("harvester"), role("upgrader"));
  // digEnergy();
  applyRole(new Harvester(), "harvester");
  applyRole(new Upgrader(), "upgrader");
  //.filter((item: Creep) => item.memory.role === "harvester");
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

function cleanMemory() {
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
}

function spawnCreeps(harvesters: Creep[], upgraders: Creep[]) {
  spawnCreep(harvesters, "harvester", 1);
  spawnCreep(upgraders, "upgrader", 2);
}

function spawnCreep(harvesters: Creep[], roleName: string, max: number) {
  let creepCount = harvesters.length;
  console.log(`${roleName} => ${creepCount}`);
  if (creepCount < max) {
    console.log(`spawning ${roleName}`);
    let rn = roleName + "-" + Math.floor(Math.random() * 10000);
    var r = Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], rn, {
      memory: { role: roleName, working: true, room: Game.spawns["Spawn1"].room.name },
      dryRun: false
    });
  }
}
// function digEnergy() {
//   for (var name in Game.creeps) {
//     var creep = Game.creeps[name];
//     if (creep.store.getFreeCapacity() > 0) {
//       var sources = creep.room.find(FIND_SOURCES);
//       if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
//         creep.moveTo(sources[0]);
//       }
//     } else {
//       if (creep.transfer(Game.spawns["Spawn1"], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
//         creep.moveTo(Game.spawns["Spawn1"]);
//       }
//     }
//   }
// }
