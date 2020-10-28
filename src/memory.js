function get_memory(v) {
    return Memory[v];
}

function get_creep_memory(creep, key) {
    return creep.memory[key];
}

function set_memory(k, v) {
    Memory[k]=v;
}

exports.get_memory = get_memory;
exports.set_memory = set_memory;
exports.get_creep_memory = get_creep_memory;
