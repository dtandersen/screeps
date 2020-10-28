import { Command } from "job/command";
import { MiningJob } from "job/job.miner";
import { Job, JobManager } from "role/jobmanager";
import { ScreepsWorld } from "screeps";

export class MiningAdviser implements Command {
    world: ScreepsWorld;
    jobManager: JobManager;

    constructor(world: ScreepsWorld, jobManager: JobManager) {
        this.world = world;
        this.jobManager = jobManager;
    }

    run() {
        for (let name in this.world.sources()) {
            // console.log('source=' + name);
            let job = new MiningJob('mining-job-' + name, 'miner-' + name);
            job.type = "MINE";
            job.source_id = name;

            let existing = this.jobManager.find('mining-job-' + name);
            // console.log('existing=' + existing);
            if (existing === undefined) {
                console.log('job=' + job);
                this.jobManager.add(job);
            }
        }
    }
}