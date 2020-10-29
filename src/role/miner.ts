import { ScreepsWorld } from "screeps";
import { Role, RoleContext } from "./role";

export class Miner extends Role {
    private world: ScreepsWorld;

    constructor(world: ScreepsWorld) {
        super("miner");
        this.world = world;
    }

    execute(context: RoleContext): void {
        let creep = context.creepEntity;
        let sourceId = creep.memory('sourceId');

        try {
            let source = this.world.sources()[sourceId];
            creep.harvest(source);
        }
        catch (e) {
            creep.moveTo(creep.memory('x'), creep.memory('y'));
        }
    }
}
