import { Position } from "entity/creep";
import { RoomLayout } from "entity/layout";
import { Command } from "job/command";
import { PathFinder2 as PathFinder2 } from "pathjgen";
import { ConstructionManager } from "role/construction.manager";
import { ScreepsWorld } from "screeps";

export class RoadAdviser implements Command {
    world: ScreepsWorld;
    constructionManager: ConstructionManager;
    pathFinder: PathFinder2;

    constructor(
        world: ScreepsWorld,
        constructionManager: ConstructionManager,
        pathFinder: PathFinder2) {
        this.world = world;
        this.constructionManager = constructionManager;
        this.pathFinder = pathFinder;
    }

    run() {
        let layout = new RoomLayout();

        let spawn = this.world.findSpawn('Spawn1');
        for (let source of Object.values(this.world.sources())) {
            let start = new Position(spawn.x, spawn.y, spawn.room);
            let finish = new Position(source.x, source.y, spawn.room);
            let path = this.pathFinder.search(start, finish);

            for (let pos of path) {
                layout.add(pos.x, pos.y, 'road');
            }

        }

        this.constructionManager.addLayout(spawn.room, layout);
    }
}
