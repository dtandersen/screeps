export class Job {
    id: string;
    type?: string;
    target?: string;

    constructor(id: string) {
        this.id = id;
    }
}

export interface JobManager {
    find(id: string): Job;
    add(job: Job): void;
    jobs(): Job[];
}

export class InMemoryJobManager implements JobManager {
    _jobs: { [name: string]: any } = {};

    jobs(): Job[] {
        return Object.values(this._jobs);
    }

    add(job: Job): void {
        this._jobs[job.id] = job;
    }

    find(id: string): Job {
        return this._jobs[id];
    }
}
