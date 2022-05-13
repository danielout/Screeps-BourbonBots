import { ErrorMapper } from "utils/ErrorMapper";
import { roleHarvester } from 'roles/harvester';
import { roleUpgrader } from 'roles/upgrader';
import { roleBuilder } from 'roles/builder';
import { roleHauler } from "roles/hauler";
import { roleFixer } from "roles/fixer";
import { manageSpawns } from 'spawning/spawn-creeps';
import { doStartup } from 'utils/StartupHelper';
import { isUndefined } from "lodash";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples

  interface CreepCount {
    type: string;
    count: number;
  }

  interface Memory {
    uuid: number;
    log: any;
    CreepCounts: Array<CreepCount>;
  }

  interface CreepMemory {
    role: string;
/*    room: string;
    working: boolean; */
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }

}

let startupDone: boolean;

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});

module.exports.loop = function () {
  if (isUndefined(startupDone)) {
    doStartup();
    let startupDone = true;
  }

  manageSpawns();

  for(var name in Game.creeps) {
      var creep = Game.creeps[name];
      if(creep.memory.role == 'harvester') {
        roleHarvester.run(creep);
      }
      if(creep.memory.role == 'upgrader') {
        roleUpgrader.run(creep);
      }
      if(creep.memory.role == 'builder') {
        roleBuilder.run(creep);
      }
      if(creep.memory.role == 'hauler') {
        roleHauler.run(creep);
    }
      if(creep.memory.role == 'fixer') {
        roleFixer.run(creep);
    }
  }
}