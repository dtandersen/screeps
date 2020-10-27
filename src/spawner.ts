import { RoleManager } from "rolemanager";
import { IdGenerator, ScreepsWorld } from "screeps";

export class CreepSpawner {
    roleManager: RoleManager;
    screepsWorld: ScreepsWorld;
    idGenerator: IdGenerator;

    constructor(roleManager: RoleManager, screepsWorld: ScreepsWorld, idGenerator: IdGenerator) {
        this.roleManager = roleManager;
        this.screepsWorld = screepsWorld;
        this.idGenerator = idGenerator;
    }

    spawn() {
        let harvesters = this.screepsWorld.count_role('harvester');
        let upgraders = this.screepsWorld.count_role('upgrader');

        this.screepsWorld.limit('harvester', 2);
        this.screepsWorld.limit('upgrader', 4);

        if (harvesters < 1) {
            this.screepsWorld.spawn('harvester-' + this.idGenerator.next_id(), 'harvester')
        } else if (upgraders < 10) {
            this.screepsWorld.spawn('upgrader-' + this.idGenerator.next_id(), 'upgrader')
        }
    }
}
