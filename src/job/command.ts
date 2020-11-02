import { RoadAdviser } from "adviser/road.adviser";
import { MiningAdviser } from "adviser/mining.adviser";
import { ConstructionManager } from "role/construction.manager";
import { PathFinder2 } from "pathjgen";
import { JobManager } from "role/jobmanager";
import { RandomIdGenerator, ScreepsWorld } from "screeps";
import { JobDeployer } from "./job";
import { RoleManager } from "role/rolemanager";
import { CreepSpawner } from "spawner";
import { RoleRunner } from "role/runner";

export interface Command {
    run(): void;
}

export class CommandFactory {
    world: ScreepsWorld;
    jobManager: JobManager;
    constructionManager: ConstructionManager;
    pathFinder: PathFinder2;
    roleManager: RoleManager;

    constructor(
        {
            world,
            jobManager,
            constructionManager,
            pathFinder,
            roleManager
        }: {
            world: ScreepsWorld,
            jobManager: JobManager,
            constructionManager: ConstructionManager,
            pathFinder: PathFinder2,
            roleManager: RoleManager
        }) {
        this.world = world;
        this.jobManager = jobManager;
        this.constructionManager = constructionManager;
        this.pathFinder = pathFinder;
        this.roleManager = roleManager;
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

    jobRunner(): JobDeployer {
        return new JobDeployer(this.jobManager);
    }

    creepSpawner(): CreepSpawner {
        return new CreepSpawner(this.roleManager, this.world, new RandomIdGenerator());
    }

    roleRunner(): RoleRunner {
        return new RoleRunner(this.world, this.roleManager);
    }
}
