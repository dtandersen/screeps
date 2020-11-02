import { Position } from "entity/creep";
import { RoomLayout } from "entity/layout";
import { Command } from "job/command";
import { LayoutJob } from "job/layout.job";
import { PathFinder2 as PathFinder2 } from "pathjgen";
import { ConstructionManager } from "role/construction.manager";
import { JobManager } from "role/jobmanager";
import { ScreepsWorld } from "screeps";
import { System } from "system/system.runner";

export class RoadAdviser implements Command, System {
    world: ScreepsWorld;
    constructionManager: ConstructionManager;
    jobManager: JobManager;
    pathFinder: PathFinder2;

    constructor(
        world: ScreepsWorld,
        constructionManager: ConstructionManager,
        jobManager: JobManager,
        pathFinder: PathFinder2) {
        this.world = world;
        this.constructionManager = constructionManager;
        this.jobManager = jobManager;
        this.pathFinder = pathFinder;
    }

    run() {
        let layout = new RoomLayout({ elements: {} });

        let spawn = this.world.findSpawn('Spawn1');
        for (let source of Object.values(this.world.sources())) {
            let start = new Position(spawn.x, spawn.y, spawn.room);
            let finish = new Position(source.x, source.y, spawn.room);
            let path = this.pathFinder.search(start, finish);

            for (let pos of path) {
                layout.add(pos.x, pos.y, 'road');
            }

        }

        this.jobManager.add(new LayoutJob({
            id: `layout-${spawn.room}`,
            layout: layout
        }));
        this.constructionManager.addLayout(spawn.room, layout);
    }
}
