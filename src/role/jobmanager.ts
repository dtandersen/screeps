import { get_memory, set_memory } from "memory";

export class Job {
    id: string;
    type: string;
    source_id?: string;

    constructor(id: string, type: string) {
        this.id = id;
        this.type = type;
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

export class ScreepsJobManager implements JobManager {
    // _jobs: { [name: string]: any } = {};

    jobs(): Job[] {
        return Object.values(this.jobMap());
    }

    add(job: Job): void {
        this.jobMap()[job.id] = job;
    }

    find(id: string): Job {
        // let jobs: { [name: string]: Job } = get_memory('jobs');
        return this.jobMap()[id];
    }

    jobMap(): { [name: string]: Job } {
        let jobs = get_memory('jobs');

        if (jobs == null) {
            jobs = {}
            set_memory('jobs', jobs);
        }

        return jobs;
    }
}
