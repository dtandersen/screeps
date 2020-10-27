function get_memory(v) {
    return Memory[v];
}

function set_memory(k, v) {
    Memory[k]=v;
}

exports.get_memory = get_memory;
exports.set_memory = set_memory;
