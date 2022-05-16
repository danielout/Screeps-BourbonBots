import { isUndefined, random } from "lodash";

export var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (isUndefined(creep.memory.harvestTarget)) {
            console.log("Finding a node for harvester: " + creep.name);
            // Find a node with no workers
            function checkWorker(source: sourceData, sourceIndex: number) {
                if (source.workers == null && isUndefined(creep.memory.harvestTarget)) {
                    creep.memory.harvestTarget = source.id;
                    Memory.rooms[creep.room.name].sources[sourceIndex].workers = creep.name;
                    console.log("Harvester " + creep.name + " has claimed Source " + source.id);
                }
            }
            _.forEach(Memory.rooms[creep.room.name].sources, checkWorker);
            if (isUndefined(creep.memory.harvestTarget)) {
                console.log(creep.name + " was unable to find a harvesting target!");
            }
        } else {
            var mySource = Game.getObjectById(creep.memory.harvestTarget);
            if(creep.harvest(mySource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(mySource, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleHarvester;
