import { RoadAdviser } from "adviser/road.adviser";
import { MiningAdviser } from "adviser/mining.adviser";
import { ConstructionManager } from "role/construction.manager";
import { PathFinder2 } from "pathjgen";
import { JobManager } from "role/jobmanager";
import { ScreepsWorld } from "screeps";

export interface Command {
    run(): void;
}

export class CommandFactory {
    world: ScreepsWorld;
    jobManager: JobManager;
    constructionManager: ConstructionManager;
    pathFinder: PathFinder2;

    constructor(
        {
            world,
            jobManager,
            constructionManager,
            pathFinder
        }: {
            world: ScreepsWorld,
            jobManager: JobManager,
            constructionManager: ConstructionManager,
            pathFinder: PathFinder2
        }) {
        this.world = world;
        this.jobManager = jobManager;
        this.constructionManager = constructionManager;
        this.pathFinder = pathFinder;
    }

    miningAdviser(): MiningAdviser {
        return new MiningAdviser(this.world, this.jobManager);
    };

    roadAdviser(): RoadAdviser {
        return new RoadAdviser(
            this.world,
            this.constructionManager,
            this.jobManager,
            this.pathFinder);
    }
}
