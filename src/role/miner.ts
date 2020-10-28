import { Role, RoleContext } from "./role";

export class Miner extends Role {
    constructor() {
        super("miner");
    }

    execute(context: RoleContext): void {
        console.log(`miner exec`);
        let entity = context.creepEntity;
        entity.moveTo(entity.memory('x'), entity.memory('y'));
    }
}
