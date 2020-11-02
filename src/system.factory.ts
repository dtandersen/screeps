import { RoadAdviser } from "system/road.adviser";
import { MiningAdviser } from "system/mining.adviser";
import { ConstructionManager } from "gateway/construction.manager";
import { PathFinder2 } from "pathjgen";
import { JobManager } from "gateway/job.manager";
import { RandomIdGenerator, ScreepsWorld } from "gateway/screeps";
import { JobDeployer } from "./job/job";
import { RoleManager } from "gateway/role.manager";
import { CreepSpawner } from "system/spawner";
import { RoleRunner } from "system/runner";

export class SystemFactory {
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
