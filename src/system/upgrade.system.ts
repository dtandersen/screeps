import { IdGenerator, ScreepsWorld, SpawnRequest } from "gateway/screeps";
import { System } from "./system.runner";

export class UpgradeSystem implements System {
    world: ScreepsWorld;
    idGenerator: IdGenerator;

    constructor(world: ScreepsWorld, idGenerator: IdGenerator) {
        this.world = world;
        this.idGenerator = idGenerator;
    }

    run(): void {
        let upgraders = this.world.count_role('upgrader');

        if (upgraders < 10) {
            let spawn = this.world.findSpawn('Spawn1');
            let id = this.idGenerator.next_id()

            this.world.requestSpawn(
                new SpawnRequest({
                    name: `upgrader-${id}`,
                    body: ["work", "carry", "move"],
                    memory: {
                        role: 'upgrader',
                        working: true,
                        room: spawn.room
                    },
                    priority: 1
                }));
        }
    }
}
