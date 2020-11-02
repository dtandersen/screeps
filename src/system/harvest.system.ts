import { IdGenerator, ScreepsWorld, SpawnRequest } from "gateway/screeps";
import { System } from "./system.runner";

export class HarvestSystem implements System {
    world: ScreepsWorld;
    idGenerator: IdGenerator;

    constructor(world: ScreepsWorld, idGenerator: IdGenerator) {
        this.world = world;
        this.idGenerator = idGenerator;
    }

    run(): void {
        let harvesters = this.world.count_role('harvester');

        if (harvesters < 2) {
            let spawn = this.world.findSpawn('Spawn1');
            let id = this.idGenerator.next_id();

            this.world.requestSpawn(
                new SpawnRequest({
                    name: `harvester-${id}`,
                    body: ["work", "carry", "move"],
                    memory: {
                        role: 'harvester',
                        working: true,
                        room: spawn.room
                    },
                    priority: 9
                }));
        }
    }
}
