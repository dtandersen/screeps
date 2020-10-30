import { ExtensionAdviser } from "adviser/construction.adviser";
import { MiningAdviser } from "adviser/mining.adviser";
import { ConstructionManager } from "role/construction.manager";
import { PathFinder } from "pathjgen";
import { JobManager } from "role/jobmanager";
import { ScreepsWorld } from "screeps";

export interface Command {
    run(): void;
}

export class CommandFactory {
    world: ScreepsWorld;
    jobManager: JobManager;
    constructionManager: ConstructionManager;
    pathFinder: PathFinder;

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
            pathFinder: PathFinder
        }) {
        this.world = world;
        this.jobManager = jobManager;
        this.constructionManager = constructionManager;
        this.pathFinder = pathFinder;
    }

    miningAdviser(): MiningAdviser {
        return new MiningAdviser(this.world, this.jobManager);
    };

    roadAdviser(): ExtensionAdviser {
        return new ExtensionAdviser(this.world, this.constructionManager, this.pathFinder);
    }
}
