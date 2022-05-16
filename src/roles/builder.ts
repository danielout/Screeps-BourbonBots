

export var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) { // If we have an empty inventory, fix that
            // We priorotize dropped resources
            var drops = creep.pos.findClosestByPath(creep.room.find(FIND_DROPPED_RESOURCES));
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
                var closestSource = creep.pos.findClosestByPath(sources);
                if(creep.withdraw(closestSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { // If we aren't in range of our target, move to it. Otherwise, withdraw energy
                    creep.moveTo(closestSource, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                var closestSite = creep.pos.findClosestByPath(targets);
                if(creep.build(closestSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestSite, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;
