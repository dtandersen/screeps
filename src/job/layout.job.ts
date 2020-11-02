import { RoomLayout } from "entity/layout";
import { Job, JobManager } from "role/jobmanager";
import { ScreepsWorld, SpawnRequest } from "screeps";

export class LayoutJob extends Job {
    source_id?: string | undefined;
    layout: RoomLayout;

    constructor(
        {
            id,
            layout
        }:
            {
                id: string,
                layout: RoomLayout
            }) {
        super(id, 'layout');
        this.layout = layout;
    }
}

export class LayoutJobHandler {
    jobManager: JobManager;
    world: ScreepsWorld;

    constructor(world: ScreepsWorld, jobManager: JobManager) {
        this.world = world;
        this.jobManager = jobManager;
    }

    run(job: LayoutJob): void {
        let spawn = this.world.findSpawn('Spawn1');
        let id = `builder-${spawn.room}`;
        try {
            let creep = this.world.findCreep(id);
        } catch (e) {
            this.world.requestSpawn(
                new SpawnRequest({
                    name: id,
                    body: ['work', 'carry', 'move'],
                    memory: {
                        role: 'builder'
                    },
                    priority: 5
                }));
        }
    }
}
