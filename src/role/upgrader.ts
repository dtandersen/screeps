import { Role, RoleContext } from "./role";

export class Upgrader extends Role {
  constructor() {
    super('upgrader');
  }

  execute(context: RoleContext): void {
    let creep = context.creep;

    var creepCarry = creep.store.getUsedCapacity(RESOURCE_ENERGY);
    var creepCarryCap = creep.store.getCapacity(RESOURCE_ENERGY);

    if (!creep.memory.working && creepCarry === 0) {
      creep.memory.working = true;
    } else if (creep.memory.working && creepCarry === creepCarryCap) {
      creep.memory.working = false;
    }

    if (creep.memory.working) {
      let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE)!;
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
      creep.say("🪓");
    } else if (!creep.memory.working) {
      if (creep.upgradeController(creep.room.controller!) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller!);
      }
      creep.say("⚙️");
    }
  }
}
