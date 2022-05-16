import { updateCreeps } from "utils/CreepUtils";

export function manageSpawns(harvestersRequired: number) {

    /* Define our population targets */
    let harvesterMin = harvestersRequired;
    let harvesterMax = harvestersRequired + 1;
    let builderMin = 2;
    let builderMax = 4;
    let upgraderMin = 2;
    let upgraderMax = 4;
    let haulerMin = 2;
    let haulerMax = 4;
    let fixerMin = 1;
    let fixerMax = 1;
    let plebRatio: [number, number, number, number, number, number, number, number, number] = [0.75, 1, 0, 0, 0, 0, 0, 0, 0];
    let harvestRatio: [number, number, number, number, number, number, number, number, number] = [5, 0, 0, 0, 0, 0, 0, 1, 6];
    let haulRatio: [number, number, number, number, number, number, number, number, number] = [0, 1, 0, 0, 0, 0, 0, 0, 0];

    /* Define our spawning functions */
    function spawnHarvester(bodyConfig) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName + ' // SPAWN RESULT: ' + Game.spawns['BourbonSpawn'].spawnCreep(bodyConfig, newName, {memory: {role: 'harvester'}}));
    }
    function spawnBuilder(bodyConfig) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName + ' // SPAWN RESULT: ' + Game.spawns['BourbonSpawn'].spawnCreep(bodyConfig, newName,{memory: {role: 'builder'}}));
    }
    function spawnUpgrader(bodyConfig) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName + ' // SPAWN RESULT: ' + Game.spawns['BourbonSpawn'].spawnCreep(bodyConfig, newName, {memory: {role: 'upgrader'}}));
    }
    function spawnHauler(bodyConfig) {
        var newName = 'Hauler' + Game.time;
        console.log('Spawning new hauler: ' + newName + ' // SPAWN RESULT: ' + Game.spawns['BourbonSpawn'].spawnCreep(bodyConfig, newName, {memory: {role: 'hauler'}}));
    }
    function spawnFixer(bodyConfig) {
        var newName = 'Fixer' + Game.time;
        console.log('Spawning new fixer: ' + newName + ' // SPAWN RESULT: ' + Game.spawns['BourbonSpawn'].spawnCreep(bodyConfig, newName, {memory: {role: 'fixer'}}));
    }

    // Function to figure out how much we can maximally spend on a creep
    function getCreepTraitCostMax() {
        let traitCost = 300
        let tempArray = _.filter(Game.structures, (structure) => structure.structureType == 'extension');
        traitCost = traitCost + (50 * tempArray.length)
        return traitCost;
    }

    // Function to calculate the best possible body we can make based on the funds. wants a lsit of numbers to determine part ratios
    function calculateBestBody(funds, workPerMove, carryPerMove, healPerMove, attackPerMove, rangedPerMove, claimPerMove, toughPerMove, maxMove, maxParts) {
        // DEBUG MODE - set this to true to enable verbose output logging
        var debugMode = false;

        // Setup our initial variables
        var remainingFunds = funds;
        var partLimit = 50;
        var finalCost = 0;
        var arrayDone = false;
        var finishedArray = [];
        var [moveArray, workArray, carryArray, healArray, attackArray, rangedArray, claimArray, toughArray] = [[], [], [], [], [], [], [], []];
        var [moveDone, workDone, carryDone, healDone, attackDone, rangedDone, claimDone, toughDone] = [false, false, false, false, false, false, false, false];

        // If maxParts is non-zero, set our part limit to that.
        if (maxParts != 0) { partLimit = maxParts; }
        // If maxMove is 0, lets just make maxMove equal to
        if (maxMove == 0) { maxMove = 50; }

        // If our desired 'per move' numbers are 0 for any part type, we can go ahead and set those to done.
        if (workPerMove == 0) { workDone = true; }
        if (carryPerMove == 0) { carryDone = true; }
        if (healPerMove == 0) { healDone = true; }
        if (attackPerMove == 0) { attackDone = true; }
        if (rangedPerMove == 0) { rangedDone = true; }
        if (claimPerMove == 0) { claimDone = true; }
        if (toughPerMove == 0) { toughDone = true; }

        // All our functions to add parts
        function addMove() {
            if(debugMode) { console.log("Trying to add move"); }
            if ((remainingFunds >= BODYPART_COST.move) && (moveArray.length < maxMove)) {
                moveArray.push(MOVE);
                remainingFunds = remainingFunds - BODYPART_COST.move;
            } else if(maxMove == moveArray.length) {
                moveDone = true;
            } else {
                moveDone = true;
            }
        }
        function addwork() {
            if (remainingFunds >= BODYPART_COST.work) {
                workArray.push(WORK);
                remainingFunds = remainingFunds - BODYPART_COST.work;
            } else {
                workDone = true;
            }
        }
        function addcarry() {
            if (remainingFunds >= BODYPART_COST.carry) {
                carryArray.push(CARRY);
                remainingFunds = remainingFunds - BODYPART_COST.carry;
            } else {
                carryDone = true;
            }
        }
        function addheal() {
            if (remainingFunds >= BODYPART_COST.heal) {
                healArray.push(HEAL);
                remainingFunds = remainingFunds - BODYPART_COST.heal;
            } else {
                healDone = true;
            }
        }
        function addattack() {
            if (remainingFunds >= BODYPART_COST.attack) {
                attackArray.push(ATTACK);
                remainingFunds = remainingFunds - BODYPART_COST.attack;
            } else {
                attackDone = true;
            }
        }
        function addranged() {
            if (remainingFunds >= BODYPART_COST.ranged_attack) {
                rangedArray.push(RANGED_ATTACK);
                remainingFunds = remainingFunds - BODYPART_COST.ranged_attack;
            } else {
                rangedDone = true;
            }
        }
        function addclaim() {
            if (remainingFunds >= BODYPART_COST.claim) {
                claimArray.push(CLAIM);
                remainingFunds = remainingFunds - BODYPART_COST.claim;
            } else {
                claimDone = true;
            }
        }
        function addtough() {
            if (remainingFunds >= BODYPART_COST.tough) {
                toughArray.push(TOUGH);
                remainingFunds = remainingFunds - BODYPART_COST.tough;
            } else {
                toughDone = true;
            }
        }

        // Start by adding a move, because every creep needs at least one MOVE. We don't need to test for this one.
        addMove();

        // Our function to loop through adding parts until we have a finished part array
        while(arrayDone == false) {

            // We need to be able to skip adding moves if other parts meet the ratio requirements, so lets track if we successfully added any so we can try again before adding more moves
            var skipMove = false;

            // Okay try adding everything that isn't a move first, in the priority order we want.
            if (workDone == false && (Math.max(1,Math.floor(workPerMove * moveArray.length)) > workArray.length)) {
                if(debugMode) { console.log("Adding work"); }
                addwork();
                skipMove = true;
            } else if (workDone == false && remainingFunds < BODYPART_COST.work) {
                // Alright we can't afford any more of these, so no matter what we're done with this part.
                workDone = true;
            }

            if (carryDone == false && (Math.max(1,Math.floor(carryPerMove * moveArray.length)) > carryArray.length)) {
                if(debugMode) { console.log("Adding carry"); }
                addcarry();
                skipMove = true;
            } else if (carryDone == false && remainingFunds < BODYPART_COST.carry) {
                // Alright we can't afford any more of these, so no matter what we're done with this part.
                carryDone = true;
            }

            if (healDone == false && (Math.max(1,Math.floor(healPerMove * moveArray.length)) > healArray.length)) {
                if(debugMode) { console.log("Adding heal"); }
                addheal();
                skipMove = true;
            } else if (healDone == false && remainingFunds < BODYPART_COST.heal) {
                // Alright we can't afford any more of these, so no matter what we're done with this part.
                healDone = true;
            }

            if (attackDone == false && (Math.max(1,Math.floor(attackPerMove * moveArray.length)) > attackArray.length)) {
                if(debugMode) { console.log("Adding attack"); }
                addattack();
                skipMove = true;
            } else if (attackDone == false && remainingFunds < BODYPART_COST.attack) {
                // Alright we can't afford any more of these, so no matter what we're done with this part.
                attackDone = true;
            }

            if (rangedDone == false && (Math.max(1,Math.floor(rangedPerMove * moveArray.length)) > rangedArray.length)) {
                if(debugMode) { console.log("Adding ranged"); }
                addranged();
                skipMove = true;
            } else if (rangedDone == false && remainingFunds < BODYPART_COST.ranged_attack) {
                // Alright we can't afford any more of these, so no matter what we're done with this part.
                rangedDone = true;
            }

            if (claimDone == false && (Math.max(1,Math.floor(claimPerMove * moveArray.length)) > claimArray.length)) {
                if(debugMode) { console.log("Adding claim"); }
                addclaim();
                skipMove = true;
            } else if (claimDone == false && remainingFunds < BODYPART_COST.claim) {
                // Alright we can't afford any more of these, so no matter what we're done with this part.
                claimDone = true;
            }

            if (toughDone == false && (Math.max(1,Math.floor(toughPerMove * moveArray.length)) > toughArray.length)) {
                if(debugMode) { console.log("Adding tough"); }
                addtough();
                skipMove = true;
            } else if (toughDone == false && remainingFunds < BODYPART_COST.tough) {
                // Alright we can't afford any more of these, so no matter what we're done with this part.
                toughDone = true;
            }

            // If we aren't done adding moves yet, and didn't add any other parts this round, try to add one.
            if (moveDone == false && skipMove == false) {
                if(debugMode) { console.log("Adding move"); }
                addMove();
            }

            // let us know we're done if we hit our
            if (partLimit == (moveArray.length + workArray.length + carryArray.length + healArray.length + attackArray.length + rangedArray.length + claimArray.length + toughArray.length)) {
                workDone = true;
                carryDone = true;
                moveDone = true;
                healDone = true;
                attackDone = true;
                rangedDone = true;
                claimDone = true;
                toughDone = true;
            }

            // If all our parts are done, build our final array!
            if(moveDone == true && workDone == true && carryDone == true && healDone == true && attackDone == true && rangedDone == true && claimDone == true && toughDone == true) {
                // We're hard coding our priority here, like fools.
                finishedArray = [].concat(toughArray, workArray, carryArray, attackArray, healArray, claimArray, moveArray);
                // Lets return our final cost, too. In case it is below our available funds
                finalCost = funds - remainingFunds;
                arrayDone = true;
            }
        }

        // Big output block to let us know what our results were - can safely comment this out to prevent spamming the console.
        /*
        console.log("End of loop status: \n",
        "Initial Funds: " + funds + " // Remaining funds: " + remainingFunds + " // Build cost: " + finalCost +"\n",
        "  Move Done: " + moveDone + " //// Move Limit: " + maxMove + " //// Move Array: " + moveArray + "\n",
        "  work Done: " + workDone + " //// work Ratio: " + workPerMove + " //// work Array: " + workArray + "\n",
        " carry Done: " + carryDone + " /// carry Ratio: " + carryPerMove + " /// carry Array: " + carryArray + "\n",
        "  heal Done: " + healDone + " //// heal Ratio: " + healPerMove + " //// heal Array: " + healArray + "\n",
        "attack Done: " + attackDone + " // attack Ratio: " + attackPerMove + " // attack Array: " + attackArray + "\n",
        "ranged Done: " + rangedDone + " // ranged Ratio: " + rangedPerMove + " // ranged Array: " + rangedArray + "\n",
        " claim Done: " + claimDone + " /// claim Ratio: " + claimPerMove + " /// claim Array: " + claimArray + "\n",
        " tough Done: " + toughDone + " /// tough Ratio: " + toughPerMove + " /// tough Array: " + toughArray + "\n",
        "Final array: " + finishedArray);
        */


        // Once we're done building the array, we should return it and the final cost of our build
        return [finalCost, finishedArray];
    }

    // Do a cost check - return true or false based on if we can afford the price
    function costCheck(price) {
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

    // Update our current creep info!
    updateCreeps();
    // Get our max moolah
    let maxPossibleFunds = getCreepTraitCostMax();

    /* Make arrays of our creeps */
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    let haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    let fixers = _.filter(Game.creeps, (creep) => creep.memory.role == 'fixer');

    /* Check our population counts against our targets, spawning if necessary. Also don't try to spawn one if you're already spawning */
    if(Game.spawns['BourbonSpawn'].spawning == null) {
        if( // Make sure we're at our role minimums first - getting those secured is pri 1!
            (harvesters.length < harvesterMin) ||
            (builders.length < builderMin) ||
            (upgraders.length < upgraderMin) ||
            (haulers.length < haulerMin) ||
            (fixers.length < fixerMin)
            ) {
                if(harvesters.length < harvesterMin) {
                    let harvesterSpawn = calculateBestBody(maxPossibleFunds, ...harvestRatio);
                    let harvesterBody = harvesterSpawn[1];
                    if(costCheck(harvesterSpawn[0]) == true) {
                        spawnHarvester(harvesterBody);
                    } else if (costCheck(250) == true) {
                        console.log('Cannot afford our max size harvester. Spawning a smaller lad for now.');
                        spawnHarvester([WORK, WORK, MOVE]);
                    }
                }
                else if (haulers.length < haulerMin) {
                    let haulerSpawn = calculateBestBody(maxPossibleFunds, ...haulRatio);
                    let haulerBody = haulerSpawn[1];
                    if(costCheck(haulerSpawn[0]) == true) {
                        spawnHauler(haulerBody);
                    } else if (costCheck(200) == true) {
                        console.log('Cannot afford our max size hauler. Spawning a smaller lad for now')
                        spawnHauler([CARRY, CARRY, MOVE, MOVE]);
                    }
                } else {
                    let plebSpawn = calculateBestBody(maxPossibleFunds, ...plebRatio);
                    let plebBody = plebSpawn[1];
                    if ((upgraders.length < upgraderMin) &&(costCheck(plebSpawn[0]) == true)) { spawnUpgrader(plebBody); }
                    else if ((builders.length < builderMin) && (costCheck(plebSpawn[0]) == true)) { spawnBuilder(plebBody); }
                    else if ((fixers.length < fixerMin) && (costCheck(plebSpawn[0]) == true)) { spawnFixer(plebBody); }
                }
        } // If we meet all our minimums, and if we aren't at our max for any role, spawn those.
        else if(
            (builders.length < builderMax) ||
            (upgraders.length < upgraderMax) ||
            (haulers.length < haulerMax) ||
            (fixers.length < fixerMax) ||
            (harvesters.length < harvesterMax)
            ) {
                if ((haulers.length < haulerMax)) {
                    let haulerSpawn = calculateBestBody(maxPossibleFunds, ...haulRatio);
                    let haulerBody = haulerSpawn[1];
                    if(costCheck(haulerSpawn[0]) == true) {
                        spawnHauler(haulerBody);
                    }
                 }
                else if(harvesters.length < harvesterMax) {
                    let harvesterSpawn = calculateBestBody(maxPossibleFunds, ...harvestRatio);
                    let harvesterBody = harvesterSpawn[1];
                    if(costCheck(harvesterSpawn[0]) == true) {
                        spawnHarvester(harvesterBody);
                    }
                } else {
                    let plebSpawn = calculateBestBody(maxPossibleFunds, ...plebRatio);
                    let plebBody = plebSpawn[1];
                    if ((upgraders.length < upgraderMax) &&(costCheck(plebSpawn[0]) == true)) {
                        spawnUpgrader(plebBody);
                    } else if ((builders.length < builderMax) && (costCheck(plebSpawn[0]) == true)) {
                        spawnBuilder(plebBody);
                    } else if ((fixers.length < fixerMax) && (costCheck(plebSpawn[0]) == true)) {
                        spawnFixer(plebBody);
                    }
                }
        }
    }

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

