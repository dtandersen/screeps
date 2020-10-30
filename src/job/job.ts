import { MiningJob, MiningJobHandler } from "job/mining";
import { Job, JobManager } from "role/jobmanager";
import { LayoutJobHandler } from "./layout.job";

export interface JobHandler {
    run(job: Job): void;
}

export class JobDeployer {
    jobManager: JobManager;
    handlers: { [type: string]: JobHandler } = {};

    constructor(jobManager: JobManager) {
        this.jobManager = jobManager;
    }

    addHandler(type: string, handler: JobHandler) {
        this.handlers[type] = handler;
    }

    run() {
        for (let job of this.jobManager.jobs()) {
            let handler = this.handlers[job.type];
            handler.run(job);
        }
    }
}
