
// this sets how we want our haulers to be created.
// TODO: We should dynamically determine this based on desired ratios rather than a switch statement, as a switch statement won't scale to 50 parts well.
// TODO: We should be smart about the order we create these in, since that's the order they're damaged. We could do better here.

export var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) { // If we don't have a full inventory, fix that.
            // We priorotize dropped resources
            var drops = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            if (drops != null) { var pickupTarget: any = "drop"; }
            if(creep.pickup(drops) == ERR_NOT_IN_RANGE) { // If we aren't in range of our target, move to it, otherwise pickup energy.
                creep.moveTo(drops, {visualizePathStyle: {stroke: '#ffaa00'}});
            } else if(drops == null) { // If there are no dropped resources, we try to pickup resources from storage
                var sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE) &&
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                var closestSource: Structure = creep.pos.findClosestByPath(sources);
                var pickupTarget: any = closestSource;
                if(creep.withdraw(closestSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { // If we aren't in range of our target, move to it. Otherwise, withdraw energy
                    creep.moveTo(closestSource, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else { // If we've got energy, let's go find somewhere to put it. Prioritizes extensions, spawns, and towers. If those fail, tries to put it in a container.

            // Find all the things we want to put energy in to that aren't full yet
            var spawnTargets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}});
            var extensionTargets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}});
            var towerTargets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}});
            var storageTargets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}});

            // Prioritized list - set the first one of these we find to be our deposit target.
            if (spawnTargets.length > 0) {
                var depositTarget: Structure = creep.pos.findClosestByPath(spawnTargets);
            } else if (extensionTargets.length > 0) {
                var depositTarget: Structure = creep.pos.findClosestByPath(extensionTargets);
            } else if (towerTargets.length > 0) {
                var depositTarget: Structure = creep.pos.findClosestByPath(towerTargets);
            } else if (storageTargets.length > 0) {
                var depositTarget: Structure = creep.pos.findClosestByPath(storageTargets);
            } else {
                var depositTarget: Structure = null;
            }

            // If we have found a valid target, move to it and deposit
            if(depositTarget != null) {
                creep.say (depositTarget.structureType);
                if(creep.transfer(depositTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { // If we aren't in range of our target, move to it. Otherwise, transfer energy
                    creep.moveTo(depositTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var moveTarget = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN);}});
                creep.moveTo(moveTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.say('Sleeping..');
            }
        }
    }
};

module.exports = roleHauler;
