import { isUndefined } from "lodash";
import { SourceNode } from "source-map";

let myTarget: SourceNode;

export var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (isUndefined(myTarget)) {
            var sources = creep.room.find(FIND_SOURCES);
            let myTarget = sources[0];
        }
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};

module.exports = roleHarvester;
