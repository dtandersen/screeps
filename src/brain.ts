import { MinerJob } from "role/job.miner";
import { Job, JobManager } from "role/jobmanager";
import { ScreepsWorld } from "screeps";

export class Brain {
    world: ScreepsWorld;
    jobManager: JobManager;

    constructor(world: ScreepsWorld, jobManager: JobManager) {
        this.world = world;
        this.jobManager = jobManager;
    }

    run() {
        for (let name in this.world.sources()) {
            let job = new MinerJob('miner-' + name);
            job.type = "MINE";
            job.target = name;

            let existing = this.jobManager.find('miner-' + name);
            if (existing == null) {
                this.jobManager.add(job);
            }
        }
    }
}
