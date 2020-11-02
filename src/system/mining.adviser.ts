import { MiningJob } from "job/mining";
import { Job, JobManager } from "gateway/job.manager";
import { ScreepsWorld } from "gateway/screeps";
import { System } from "system/system.runner";

export class MiningAdviser implements System {
    world: ScreepsWorld;
    jobManager: JobManager;

    constructor(world: ScreepsWorld, jobManager: JobManager) {
        this.world = world;
        this.jobManager = jobManager;
    }

    run() {
        for (let name in this.world.sources()) {
            let source = this.world.sources()[name];
            let job = new MiningJob('mining-job-' + name, 'miner-' + name, source.x, source.y);
            job.type = "MINE";
            job.source_id = name;

            let existing = this.jobManager.find('mining-job-' + name);
            if (existing === undefined) {
                this.jobManager.add(job);
            }
        }
    }
}
