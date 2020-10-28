import { MiningAdviser } from "adviser/mining.adviser";
import { JobManager } from "role/jobmanager";
import { ScreepsWorld } from "screeps";

export interface Command {
    run(): void;
}

export class CommandFactory {
    world: ScreepsWorld;
    jobManager: JobManager;

    constructor(
        {
            world,
            jobManager
        }: {
            world: ScreepsWorld,
            jobManager: JobManager
        }) {
        this.world = world;
        this.jobManager = jobManager;
    }

    miningAdviser(): MiningAdviser {
        return new MiningAdviser(this.world, this.jobManager);
    };

}
