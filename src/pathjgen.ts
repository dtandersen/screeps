import { Position } from "entity/creep";
import { keys } from "lodash";

export interface PathFinder2 {
    search(origin: Position, goal: Position): Position[];

}

export class MockPathGenerator implements PathFinder2 {
    _paths: { [key: string]: Position[] } = {}

    add(origin: Position, goal: Position, path: Position[]) {
        this._paths[this.key(origin, goal)] = path;
    }

    search(origin: Position, goal: Position): Position[] {
        return this._paths[this.key(origin, goal)];
    }

    key(origin: Position, goal: Position): string {
        return origin.x + "," + origin.y + "=>" + goal.x + "," + goal.y;
    }
}

export class ScreepsPathFinder implements PathFinder2 {
    search(origin: Position, goal: Position): Position[] {
        let pos1 = new RoomPosition(origin.x, origin.y, origin.roomName);
        let pos2 = new RoomPosition(goal.x, goal.y, goal.roomName);

        let path = PathFinder.search(pos1, { pos: pos2, range: 1 }, { swampCost: 0 });
        let p = path.path;

        return p.map(pos => new Position(pos.x, pos.y, pos.roomName));
    }
}
