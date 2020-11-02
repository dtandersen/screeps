import { CreepEntity } from "entity/creep";
import { RoleManager } from "gateway/role.manager";
import { ScreepsWorld } from "gateway/screeps";

export interface RoleContext {
  creep: Creep;
  creepEntity: CreepEntity;
}

export abstract class Role {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract execute(context: RoleContext): void;
}

export class ScreepRoleContext implements RoleContext {
  creep: Creep;
  creepEntity: CreepEntity;

  constructor(creep: any, creepEntity: CreepEntity) {
    this.creep = creep;
    this.creepEntity = creepEntity;
  }
}
