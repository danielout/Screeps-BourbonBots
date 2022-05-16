import { forEach, initial, isUndefined } from "lodash";
import { stringify } from "querystring";
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

    //  Lets get data about our rooms stored in memory
    var ourRooms: Array<Room> = _.filter(Game.rooms, (room) => (room.find(FIND_MY_STRUCTURES).length > 0));

    // Make sure our room array is setup I guess
    /* if (isUndefined(Memory.rooms)) {
        Memory.rooms = null;
    } */

    // Okay, time to build our room memory
    if (ourRooms.length > 0) {
        for (let i = 0; i < ourRooms.length; i++) {
            // What variables will we need here?
            var thisRoom: Room = ourRooms[i];
            var thisName = thisRoom.name

            // If this room is one we don't have any data on yet, we should establish it in Memory
            if (isUndefined(Memory.rooms[thisName]) == true) {
                console.log("Found a new room! Stubbing in schema.");
                Memory.rooms = { [thisName]: { 'sources': [], 'towers': [], 'depots': [] }};
            }

            // Go ahead and build arrays for the items in the room we care about
            var roomSources: Array<Source> = thisRoom.find(FIND_SOURCES);
            var roomTowers: Array<StructureTower> = thisRoom.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER); }})
            var roomDepots: Array<Structure> = thisRoom.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE); }})

            // Check to see if all the Sources in the room are already recorded. If they aren't, do that.
            function checkSource(thisSource: Source) {
                let loggedSources: Array<sourceData> = Memory.rooms[thisName].sources;
                var sourceLogged = false;

                // Iterate over our logged source IDs, and if we find a match we know we are done
                for (i = 0; i < loggedSources.length; i++) {
                    if(loggedSources[i].id == thisSource.id) {
                        sourceLogged = true;
                    }
                }

                // If we haven't logged this source yet, do that
                if (!sourceLogged) {
                    var sourceObj: sourceData = {
                        'id': thisSource.id,
                        'workers': null
                    }
                    loggedSources.push(sourceObj);
                    Memory.rooms[thisName].sources = loggedSources
                    console.log("Found a new source in " + thisName + " with ID " + thisSource.id + " - Logged it to Memory!")
                }
            } // End checkSource()

            function checkTowers(thisTower: StructureTower) {
                let loggedTowers: Array<towerData> = Memory.rooms[thisName].towers;
                var towerLogged = false;

                // Iterate over our logged tower IDs, and if we find a match we know we are done
                for (i = 0; i < loggedTowers.length; i++) {
                    if(loggedTowers[i].id == thisTower.id) {
                        towerLogged = true;
                    }
                }

                // If we haven't logged this tower yet, do that
                if (!towerLogged) {
                    var towerObj: towerData = {
                        'id': thisTower.id,
                        'task': null
                    }
                    loggedTowers.push(towerObj);
                    Memory.rooms[thisName].towers = loggedTowers
                    console.log("Found a new tower in " + thisName + " with ID " + thisTower.id + " - Logged it to Memory!")
                }

            } // End checkTowers()

            function checkDepots(thisDepot: Structure) {
                let loggedDepots: Array<depotData> = Memory.rooms[thisName].depots;
                var depotLogged = false;

                // Iterate over our logged depot IDs, and if we find a match we know we are done
                for (i = 0; i < loggedDepots.length; i++) {
                    if(loggedDepots[i].id == thisDepot.id) {
                        depotLogged = true;
                    }
                }

                // If we haven't logged this depot yet, do that
                if (!depotLogged) {
                    var depotObj: depotData = {
                        'id': thisDepot.id,
                        'mainUse': null
                    }
                    loggedDepots.push(depotObj);
                    Memory.rooms[thisName].depots = loggedDepots
                    console.log("Found a new depot in " + thisName + " with ID " + thisDepot.id + " - Logged it to Memory!")
                }

            } // End checkDepots()

            // Iterate over our found sources, towers, and depots and see if we need to add them
            _.forEach(roomSources, checkSource);
            _.forEach(roomTowers, checkTowers);
            _.forEach(roomDepots, checkDepots);
        }
    } else {
        console.log("We don't control any structures in any rooms! What happened?!?");
    }


} // End doStartupa

