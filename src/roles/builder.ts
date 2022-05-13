import { SourceMapConsumer } from "source-map";

export function builderConfig(howMany) {
    let builderBody = [WORK,CARRY,MOVE];
    switch (howMany) {
        case 3:
            break;
        case 4:
            builderBody = [WORK,CARRY,MOVE,MOVE];
            break;
        case 5:
            builderBody = [WORK,WORK,CARRY,MOVE,MOVE];
            break;
        case 6:
            builderBody = [WORK,WORK,WORK,CARRY,MOVE,MOVE];
            break;
        case 7:
            builderBody = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE];
            break;
    }
    return builderBody;
}

export var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) { // If we have an empty inventory, fix that
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
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;
