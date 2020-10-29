import { Command } from "job/command";
import { ScreepsWorld } from "screeps";
import { Job, JobManager } from "../role/jobmanager";

export class MiningJob extends Job {
    /** id of creep that is mining */
    miner_creep_name: string;
    x: number;
    y: number;

    constructor(id: string, miner_creep_name: string, x: number, y: number) {
        super(id);
        this.miner_creep_name = miner_creep_name;
        this.x = x;
        this.y = y;
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
        let spawn = this.world.findSpawn('Spawn1');
        let source = this.world.sources()[job.source_id!];
        this.world.spawn(
            job.miner_creep_name,
            ['work', 'work', 'move'],
            {
                role: 'miner',
                x: source.x,
                y: source.y,
                working: true,
                room: spawn.room,
                sourceId: job.source_id
            });
    }
}
