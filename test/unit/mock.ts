
// export const Game = {
//   creeps: [],
//   rooms: [],
//   spawns: {},
//   time: 12345
// };

export const Memory = {
  creeps: []
};

class G implements Game {
  cpu!: CPU;
  creeps!: { [creepName: string]: Creep; };
  flags!: { [flagName: string]: Flag; };
  gcl!: GlobalControlLevel;
  gpl!: GlobalPowerLevel;
  map!: GameMap;
  market!: Market;
  powerCreeps!: { [creepName: string]: PowerCreep; };
  resources!: { [key: string]: any; };
  rooms!: { [roomName: string]: Room; };
  spawns: { [spawnName: string]: StructureSpawn; } = {};
  structures!: { [structureId: string]: Structure<StructureConstant>; };
  constructionSites!: { [constructionSiteId: string]: ConstructionSite<BuildableStructureConstant>; };
  shard!: Shard;
  time!: number;
  getObjectById<T>(id: Id<T>): T | null;
  getObjectById<T>(id: string): T | null;
  getObjectById(id: any) {
    throw new Error("Method not implemented.");
  }
  notify(message: string, groupInterval?: number): undefined {
    throw new Error("Method not implemented.");
  }
}

export class SS implements StructureSpawn {
  prototype!: StructureSpawn;
  energy!: number;
  energyCapacity!: number;
  memory!: SpawnMemory;
  name!: string;
  spawning!: Spawning | null;
  store!: Store<"energy", false>;
  canCreateCreep(body: BodyPartConstant[], name?: string): ScreepsReturnCode {
    throw new Error("Method not implemented.");
  }
  createCreep(body: BodyPartConstant[], name?: string, memory?: CreepMemory): string | 0 | -1 | -2 | -4 | -3 | -5 | -6 | -7 | -8 | -9 | -10 | -11 | -12 | -14 | -15 {
    throw new Error("Method not implemented.");
  }
  spawnCreep(body: BodyPartConstant[], name: string, opts?: SpawnOptions): ScreepsReturnCode {
    throw new Error("Method not implemented.");
  }
  destroy(): ScreepsReturnCode {
    throw new Error("Method not implemented.");
  }
  isActive(): boolean {
    throw new Error("Method not implemented.");
  }
  notifyWhenAttacked(enabled: boolean): ScreepsReturnCode {
    throw new Error("Method not implemented.");
  }
  renewCreep(target: Creep): ScreepsReturnCode {
    throw new Error("Method not implemented.");
  }
  recycleCreep(target: Creep): ScreepsReturnCode {
    throw new Error("Method not implemented.");
  }
  my!: boolean;
  owner!: Owner;
  room!: Room;
  hits!: number;
  hitsMax!: number;
  id!: Id<this>;
  structureType!: "spawn";
  effects!: RoomObjectEffect[];
  pos!: RoomPosition;
}

export const Game = new G();
