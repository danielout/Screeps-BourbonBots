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

}
