import { manageSpawns } from 'spawning/spawn-creeps';

export function manageRoom(thisRoom: Room) {

    // If a harvester dies, remove its reservation on a node
    function cleanupDeadHarvesters(thisSource: sourceData, thisIndex: number) {
        if ((thisSource.workers != null) && ((thisSource.workers in Game.creeps) == false)) {
            console.log("Dead Harvester Detected! Removing from Source " + thisSource.id);
            Memory.rooms[thisRoom.name].sources[thisIndex].workers = null;
        }
    }
    _.forEach(Memory.rooms[thisRoom.name].sources, cleanupDeadHarvesters);

    var harvestersNeeded = Memory.rooms[thisRoom.name].sources.length;

    // Manage Spawns if we need to
    manageSpawns(harvestersNeeded);

    // Repair our room if we need to
    function repairRoom(roomName: string) {
        var structures = Game.rooms[roomName].find(FIND_STRUCTURES, {
            filter: (structure) => { return ((structure.hits != structure.hitsMax) && structure.structureType != STRUCTURE_WALL); }
        });

        if(structures.length > 0) {
            var towers: Array<StructureTower> = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.repair(structures[0]));
        }
    }
    repairRoom(thisRoom.name);

}
