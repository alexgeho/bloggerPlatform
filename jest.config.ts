//const { createDefaultPreset } = require("ts-jest");
//const tsJestTransformCfg = createDefaultPreset().transform;
import type { Config} from 'jest'
/** @type {import("jest").Config} **/
export default async () : Promise<Config> =>  ({
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testTimeout: 100000,
   moduleFileExtensions: ['ts', 'js']
});