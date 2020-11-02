import { RoadAdviser } from "system/road.adviser";
import { MiningAdviser } from "system/mining.adviser";
import { ConstructionManager } from "gateway/construction.manager";
import { PathFinder2 } from "pathjgen";
import { JobManager } from "gateway/job.manager";
import { IdGenerator, RandomIdGenerator, ScreepsWorld } from "gateway/screeps";
import { JobDeployer } from "./job/job";
import { RoleManager } from "gateway/role.manager";
import { CreepSpawner } from "system/spawner";
import { RoleRunner } from "system/runner";
import { Upgrader } from "role/upgrader";
import { UpgradeSystem } from "system/upgrade.system";
import { HarvestSystem } from "system/harvest.system";

export class SystemFactory {
    world: ScreepsWorld;
    jobManager: JobManager;
    constructionManager: ConstructionManager;
    pathFinder: PathFinder2;
    roleManager: RoleManager;
    idGenerator: IdGenerator;

    constructor(
        {
            world,
            jobManager,
            constructionManager,
            pathFinder,
            roleManager,
            idGenerator
        }: {
            world: ScreepsWorld,
            jobManager: JobManager,
            constructionManager: ConstructionManager,
            pathFinder: PathFinder2,
            roleManager: RoleManager,
            idGenerator: IdGenerator
        }) {
        this.world = world;
        this.jobManager = jobManager;
        this.constructionManager = constructionManager;
        this.pathFinder = pathFinder;
        this.roleManager = roleManager;
        this.idGenerator = idGenerator;
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

    upgraderSystem(): UpgradeSystem {
        return new UpgradeSystem(this.world, this.idGenerator);
    }

    harvesterSystem(): HarvestSystem {
        return new HarvestSystem(this.world, this.idGenerator);
    }
}
