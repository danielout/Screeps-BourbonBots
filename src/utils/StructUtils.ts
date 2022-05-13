
export function makeStructureArray() {
    /* let structures = _filter(Game.structures ) */
}

export function getCreepTraitMax() {
    let traitCount = 3
    let tempArray = _.filter(Game.structures, (structure) => structure.structureType == 'extension');
    traitCount = traitCount + Math.floor(tempArray.length / 2);
    return traitCount;
}
