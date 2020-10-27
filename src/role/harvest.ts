import { Role } from "./role";

export class Harvester implements Role {
  execute(creep: Creep): void {
    console.log(`harvest ${creep.name}`);
    if (creep.store.getFreeCapacity() > 0) {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
      creep.say("🪓");
    } else {
      if (creep.transfer(Game.spawns["Spawn1"], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.spawns["Spawn1"]);
      }
      creep.say("⚡");
    }
  }
}
