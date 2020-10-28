import { ScreepsWorld } from "screeps";
import { Role, RoleContext } from "./role";

export class Miner extends Role {
    world: ScreepsWorld;

    constructor(world: ScreepsWorld) {
        super("miner");
        this.world = world;
    }

    execute(context: RoleContext): void {
        console.log(`miner exec`);
        let entity = context.creepEntity;
        let sourceId = entity.memory('sourceId');
        try {
            console.log(`harvest ${sourceId}`);
            entity.harvest(sourceId, this.world.sources()[sourceId]);
        }
        catch (e) {
            console.log(`moveTo`);
            entity.moveTo(entity.memory('x'), entity.memory('y'));
        }
    }
}
