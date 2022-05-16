import { filter } from "lodash";
import { SourceMapConsumer } from "source-map";

export function updateCreeps() {
    /* We assume no changes at first */
    let changesDetected = false;

    /* First: Make arrays of our creeps */
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    let haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    let fixers = _.filter(Game.creeps, (creep) => creep.memory.role == 'fixer');

    /* Iterate our role types and see if there are changes to count */
    if (harvesters.length != Memory.CreepCounts[0].count) {
        Memory.CreepCounts[0].count = harvesters.length;
        changesDetected = true;
    }
    if (builders.length != Memory.CreepCounts[1].count) {
        Memory.CreepCounts[1].count = builders.length;
        changesDetected = true;
    }
    if (upgraders.length != Memory.CreepCounts[2].count) {
        Memory.CreepCounts[2].count = upgraders.length;
        changesDetected = true;
    }
    if (haulers.length != Memory.CreepCounts[3].count) {
        Memory.CreepCounts[3].count = haulers.length;
        changesDetected = true;
    }
    if (fixers.length != Memory.CreepCounts[4].count) {
        Memory.CreepCounts[4].count = fixers.length;
        changesDetected = true;
    }

    /* We can return true or false based on if changes to creep counts were detected, in case a caller cares */
    if (changesDetected == true) {
        /* console.log('Creep Counts Changed! New Counts: Harvesters: ' + harvesters.length + ' // Builders: ' + builders.length + ' // Upgraders: ' + upgraders.length + ' // Haulers: ' + haulers.length + ' // Fixers: ' + fixers.length); */
        return true;
    } else {
        return false;
    }

}
/*
export function getClosestDepot(whatRoom: Room, myGoal: string) {
    // Get the depots for the room
    var roomDepots: Array<Structure> = [];
    _.forEach(Memory.rooms[whatRoom.name].depots, function(obj: depotData) { roomDepots.push(Game.getObjectById(obj.id)); });

    if (myGoal == "deposit") {
        var targetDepots: Array<Structure> = filter(roomDepots, (structure) => {return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;});

    }

}
*/
