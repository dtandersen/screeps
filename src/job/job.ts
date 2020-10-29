import { MiningJob, MiningJobHandler } from "job/mining";
import { JobManager } from "role/jobmanager";

export class JobDeployer {
    jobManager: JobManager;
    handler: MiningJobHandler;

    constructor(jobManager: JobManager, handler: MiningJobHandler) {
        this.jobManager = jobManager;
        this.handler = handler;
    }

    run() {
        for (let job of this.jobManager.jobs()) {
            this.handler.run(<MiningJob>job);
        }
    }
}
