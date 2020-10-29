import { EntityNotFound } from "exception";
import { Command } from "job/command";
import { ScreepsWorld, SpawnRequest } from "screeps";
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
        try {
            let creep = this.world.findCreep(job.miner_creep_name);
        } catch (e) {
            this.world.memory('requests', [
                new SpawnRequest({
                    name: job.miner_creep_name,
                    body: ['work', 'work', 'move'],
                    memory: {
                        role: 'miner',
                        x: source.x,
                        y: source.y,
                        working: true,
                        room: spawn.room,
                        sourceId: job.source_id
                    },
                    priority: 10
                })]);
        }
    }
}
