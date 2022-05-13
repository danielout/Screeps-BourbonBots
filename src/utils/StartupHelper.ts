import { initial } from "lodash";
import { SourceMapConsumer } from "source-map";

export function doStartup() {
    /* Initialize dat array in game memory */
    Memory.CreepCounts = [];

    /* Write our creep counts to Memory */
    /* First: Make arrays of our creeps */
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    let haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    let fixers = _.filter(Game.creeps, (creep) => creep.memory.role == 'fixer');

    /* Next: Write those counts to Memory */
    let harvestCount: CreepCount = {
        type: "harvesters",
        count: harvesters.length
    }
    Memory.CreepCounts[0] = harvestCount;

    let buildCount: CreepCount = {
        type: "builders",
        count: builders.length
    }
    Memory.CreepCounts[1] = buildCount;

    let upgradeCount: CreepCount = {
        type: "upgraders",
        count: upgraders.length
    };
    Memory.CreepCounts[2] = upgradeCount;

    let haulerCount: CreepCount = {
        type: "haulers",
        count: haulers.length
    };
    Memory.CreepCounts[3] = haulerCount;

    let fixerCount: CreepCount = {
        type: "fixers",
        count: fixers.length
    };
    Memory.CreepCounts[4] = haulerCount;

    /* What else do we need to do? */

}

