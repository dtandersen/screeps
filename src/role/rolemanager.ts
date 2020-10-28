import { Role } from "role/role";

export interface RoleManager {
    roles(): Role[];
}

export class InMemoryRoleManager implements RoleManager {
    _roles: { [name: string]: any } = {};

    roles(): Role[] {
        return Object.values(this._roles);
    }

    add_role(role: Role) {
        this._roles[role.name] = role;
    }
}
