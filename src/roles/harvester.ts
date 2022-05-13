import { SourceMapConsumer } from "source-map";

export function harvesterConfig(howMany) {
    let harvesterBody = [];
    switch (howMany) {
        case 3:
            harvesterBody = [WORK,WORK,MOVE];
            break;
        case 4:
            harvesterBody = [WORK,WORK,WORK,MOVE];
            break;
        case 5:
            harvesterBody = [WORK,WORK,WORK,WORK,MOVE];
            break;
        case 6:
            harvesterBody = [WORK,WORK,WORK,WORK,WORK,MOVE];
            break;
        case 7:
            harvesterBody = [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE];
            break;
    }
    return harvesterBody;
}

export var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};

module.exports = roleHarvester;
