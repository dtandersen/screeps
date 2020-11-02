export interface System {
    run(): void;
}

export class SystemRunner {
    private _systems: System[] = []

    registerSystem(system: System) {
        this._systems.push(system);
    }

    run() {
        for (let system of this._systems) {
            system.run();
        }
    }
}
