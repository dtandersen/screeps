import { Command } from "job/command";
import { ScreepsWorld } from "screeps";
import { Job, JobManager } from "../role/jobmanager";

export class MiningJob extends Job {
    /** id of creep that is mining */
    miner_creep_name: string;

    constructor(id: string, miner_creep_name: string) {
        super(id);
        this.miner_creep_name = miner_creep_name;
    }
}

export class MiningJobHandler {
    jobManager: JobManager;
    world: ScreepsWorld;

    constructor(world: ScreepsWorld, jobManager: JobManager) {
        this.world = world;
        this.jobManager = jobManager;
    }

    run(job: MiningJob): void {
        this.world.spawn(job.miner_creep_name, 'miner');
    }
}
