import { SourceMapConsumer } from "source-map";

export function fixerConfig(howMany) {
    let fixerBody = [];
    switch (howMany) {
        case 3:
            fixerBody = [WORK,CARRY,MOVE];
            break;
        case 4:
            fixerBody = [WORK,CARRY,MOVE,MOVE];
            break;
        case 5:
            fixerBody = [WORK,WORK,CARRY,MOVE,MOVE];
            break;
        case 6:
            fixerBody = [WORK,WORK,WORK,CARRY,MOVE,MOVE];
            break;
        case 7:
            fixerBody = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE];
            break;
    }
    return fixerBody;
}

export var roleFixer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) { // If we don't have a full inventory, fix that.
            // We priorotize dropped resources
            var drops = creep.room.find(FIND_DROPPED_RESOURCES);
            if(creep.pickup(drops[0]) == ERR_NOT_IN_RANGE) { // If we aren't in range of our target, move to it, otherwise pickup energy.
                creep.moveTo(drops[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            } else if(drops.length == 0) { // If there are no dropped resources, we try to pickup resources from storage
                var sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE) &&
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if(creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { // If we aren't in range of our target, move to it. Otherwise, withdraw energy
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else { // If we've got energy, let's go find somewhere to put it. Prioritizes extensions, spawns, and towers. If those fail, tries to put it in a container.

            // Find all the things we want to put energy in to that aren't full yet
            var spawnTargets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}});
            var extensionTargets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}});
            var towerTargets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}});
            var storageTargets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}});

            // Prioritized list - set the first one of these we find to be our deposit target.
            if (spawnTargets.length > 0) {
                var depositTarget = spawnTargets[0];
            } else if (extensionTargets.length > 0) {
                var depositTarget = extensionTargets[0];
            } else if (towerTargets.length > 0) {
                var depositTarget = towerTargets[0];
            } else if (storageTargets.length > 0) {
                var depositTarget = storageTargets[0];
            } else {
                var depositTarget = null;
            }

            // If we have found a valid target, move to it and deposit
            if(depositTarget != null) {
                creep.say (depositTarget.structureType);
                if(creep.transfer(depositTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { // If we aren't in range of our target, move to it. Otherwise, transfer energy
                    creep.moveTo(depositTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.say('Sleeping..');
            }
        }
    }
};

module.exports = roleFixer;
