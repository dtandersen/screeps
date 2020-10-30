import { Position } from "entity/creep";
import { keys } from "lodash";

export interface PathFinder {
    search(orgin: Position, goal: Position): Position[];

}

export class MockPathGenerator implements PathFinder {
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
