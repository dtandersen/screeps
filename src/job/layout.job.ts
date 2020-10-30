import { RoomLayout } from "entity/layout";
import { Job } from "role/jobmanager";

export class LayoutJob implements Job {
    id: string;
    type?: string | undefined;
    source_id?: string | undefined;
    layout: RoomLayout;

    constructor(
        {
            id,
            layout
        }:
            {
                id: string,
                layout: RoomLayout
            }) {
        this.id = id;
        this.layout = layout;
    }
}
