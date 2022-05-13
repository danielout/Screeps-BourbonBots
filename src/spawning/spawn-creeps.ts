import { builderConfig } from "roles/builder";
import { harvesterConfig } from "roles/harvester";
import { upgraderConfig } from "roles/upgrader";
import { haulerConfig } from "roles/hauler";
import { fixerConfig } from "roles/fixer";
import { SourceMapConsumer } from "source-map";
import { updateCreeps } from "utils/CreepUtils";
import { getCreepTraitMax } from "utils/StructUtils";

export function manageSpawns() {

    /* Define our population targets */
    let harvesterMin = 1;
    let harvesterMax = 2;
    let builderMin = 1;
    let builderMax = 2;
    let upgraderMin = 1;
    let upgraderMax = 3;
    let haulerMin = 1;
    let haulerMax = 2;
    let fixerMin = 1;
    let fixerMax = 1;

    /* Define our spawning functions */
    function spawnHarvester(bodyCount) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName + ' // SPAWN RESULT: ' + Game.spawns['BourbonSpawn'].spawnCreep(harvesterConfig(bodyCount), newName, {memory: {role: 'harvester'}}));
/*        Game.spawns['BourbonSpawn'].spawnCreep(harvesterConfig(bodyCount), newName, {memory: {role: 'harvester'}}); */
    }
    function spawnBuilder(bodyCount) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['BourbonSpawn'].spawnCreep(builderConfig(bodyCount), newName,
            {memory: {role: 'builder'}});
    }
    function spawnUpgrader(bodyCount) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['BourbonSpawn'].spawnCreep(upgraderConfig(bodyCount), newName,
            {memory: {role: 'upgrader'}});
    }
    function spawnHauler(bodyCount) {
        var newName = 'Hauler' + Game.time;
        console.log('Spawning new hauler: ' + newName);
        Game.spawns['BourbonSpawn'].spawnCreep(haulerConfig(bodyCount), newName,
            {memory: {role: 'hauler'}});
    }
    function spawnFixer(bodyCount) {
        var newName = 'Fixer' + Game.time;
        console.log('Spawning new fixer: ' + newName);
        Game.spawns['BourbonSpawn'].spawnCreep(fixerConfig(bodyCount), newName,
            {memory: {role: 'fixer'}});
    }

    /* Do a cost check - only try to spawn if we can afford our best creep! */
    function costCheck(upgradeCount) {
        let price = upgradeCount * 100;
        let tempArray = _.filter(Game.structures, (structure) => structure.structureType == 'spawn');
        let currentMoney = tempArray[0].room.energyAvailable;
        if (currentMoney >= price) {
            console.log('Spawning! Current money: ' + currentMoney + ' // Price of Desired spawn: ' + price)
            return true;
        } else {
            /* console.log('NOT Spawning! Current money: ' + currentMoney + ' // Price of Desired spawn: ' + price) */
            return false;
        }
    }


    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
        delete Memory.creeps[name];
        }
    }
    /* Update our current creep info! */
    updateCreeps();
    let maxPossibleUpgrades = getCreepTraitMax();

    /* Make arrays of our creeps */
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    let haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    let fixers = _.filter(Game.creeps, (creep) => creep.memory.role == 'fixer');

    /* Check our population counts against our targets, spawning if necessary. Also don't try to spawn one if you're already spawning */
    if(Game.spawns['BourbonSpawn'].spawning == null) {
        if(
            (harvesters.length < harvesterMin) ||
            (builders.length < builderMin) ||
            (upgraders.length < upgraderMin) ||
            (haulers.length < haulerMin) ||
            (fixers.length < fixerMin)
            ) {
                if(harvesters.length < harvesterMin) {
                    let harvesterBody = Math.min(maxPossibleUpgrades,7);
                    if(costCheck(harvesterBody) == true) {
                        spawnHarvester(harvesterBody);
                    } else if (costCheck(3) == true) {
                        console.log('Cannot afford our max size harvester. Spawning a smaller lad for now.');
                        spawnHarvester(3);
                    }
                }
                else if (haulers.length < haulerMin) {
                    if(costCheck(maxPossibleUpgrades) == true) {
                        spawnHauler(maxPossibleUpgrades);
                    } else if (costCheck(3) == true) {
                        console.log('Cannot afford our max size hauler. Spawning a smaller lad for now')
                        spawnHauler(3);
                    }
                }
                else if ((upgraders.length < upgraderMin) &&(costCheck(maxPossibleUpgrades) == true)) { spawnUpgrader(maxPossibleUpgrades); }
                else if ((builders.length < builderMin) && (costCheck(maxPossibleUpgrades) == true)) { spawnBuilder(maxPossibleUpgrades); }
                else if ((fixers.length < fixerMin) && (costCheck(maxPossibleUpgrades) == true)) { spawnFixer(maxPossibleUpgrades); }
        }
        else if(
            (harvesters.length < harvesterMax) ||
            (builders.length < builderMax) ||
            (upgraders.length < upgraderMax) ||
            (haulers.length < haulerMax) ||
            (fixers.length < fixerMax)
            ) {
                if ((haulers.length < haulerMax) && (costCheck(maxPossibleUpgrades) == true)) { spawnHauler(maxPossibleUpgrades); }
                else if(harvesters.length < harvesterMax) {
                    let harvesterBody = Math.min(maxPossibleUpgrades,7);
                    if(costCheck(harvesterBody)) {
                        spawnHarvester(harvesterBody);
                    }
                }
                else if ((builders.length < builderMax) && (costCheck(maxPossibleUpgrades) == true)) { spawnBuilder(maxPossibleUpgrades); }
                else if ((upgraders.length < upgraderMax) && (costCheck(maxPossibleUpgrades) == true)) { spawnUpgrader(maxPossibleUpgrades); }
                else if ((fixers.length < fixerMax) && (costCheck(maxPossibleUpgrades) == true)) { spawnFixer(maxPossibleUpgrades); }
        }
    }

    // OLD SPAWNING CODE - PRESERVED FOR REASONS //
/*    if(harvesters.length < harvesterMin) {
        console.log('ALERT: Not at harvester minimums!');
        if (costCheck(maxPossibleUpgrades)) {
            spawnHarvester(maxPossibleUpgrades);
        } else if (costCheck(3) == true) {
            spawnHarvester(3);
            console.log('DOUBLE ALERT - can only afford basic harvesters')
        } else {
            console.log('EMERGENCY ALERT - CANNOT MAKE BASIC HARVESTERS!');
        }
    } else if ((upgraders.length < upgraderMin) && (upgraders.length < harvesters.length) && (upgraders.length < upgraderMax)) {
        if (costCheck(maxPossibleUpgrades) == true) {
            spawnUpgrader(maxPossibleUpgrades);
        }
    } else if((builders.length < builderMin) && (builders.length < harvesters.length) && (builders.length < builderMax))  {
        if (costCheck(maxPossibleUpgrades) == true) {
            spawnBuilder(maxPossibleUpgrades);
        }
    } else if((haulers.length < haulerMin) && (haulers.length < harvesters.length) && (haulers.length < haulerMax))  {
        if (costCheck(maxPossibleUpgrades) == true) {
            spawnHauler(maxPossibleUpgrades);
        }
    } else if (harvesters.length < harvesterMax) {
        if (costCheck(maxPossibleUpgrades) == true) {
            spawnHarvester(maxPossibleUpgrades);
        }
    } else {
        console.log('Max population reached!');
        return;
    }
*/
    /* Let us know we're spawning something */
    if(Game.spawns['BourbonSpawn'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['BourbonSpawn'].spawning.name];
        Game.spawns['BourbonSpawn'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['BourbonSpawn'].pos.x + 1,
            Game.spawns['BourbonSpawn'].pos.y,
            {align: 'left', opacity: 0.8});
    }
}

