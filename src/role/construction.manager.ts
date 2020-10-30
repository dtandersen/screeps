import { RoomLayout } from "entity/layout";

export interface ConstructionManager {
    addLayout(roomId: string, layout: RoomLayout): void;
}

export class InMemoryConstructionManager implements ConstructionManager {
    private _layouts: { [roomId: string]: RoomLayout } = {}

    addLayout(roomId: string, layout: RoomLayout): void {
        this._layouts[roomId] = layout;
    }

    layout(roomId: string): RoomLayout | null {
        return this._layouts[roomId];
    }
}
