import {Profile} from "../src/profile/Profile";
import fs from "fs";
import {PathsFile} from "../src/file/PathsFile";
import {StartupFile} from "../src/file/StartupFile";
import {AliasesFile} from "../src/file/AliasesFile";
import {StartupCommandsFile} from "../src/file/StartupCommandsFile";
import assert from "assert";

describe('Profile tests', () => {
	// it('simple profile - should read the correct values', () => {
	// 	const profileJson: string = fs.readFileSync('test/samples/test-profile-1.json', 'utf8');
	// 	const profileJsonParsed: any = JSON.parse(profileJson);
	// 	const profile: Profile = Profile.restore(
	// 		profileJsonParsed['_id'],
	// 		profileJsonParsed['_name'],
	// 		profileJsonParsed['_isActive'],
	// 		profileJsonParsed['_ps1'],
	// 		new PathsFile(profileJsonParsed['_pathsFile']),
	// 		new StartupFile(profileJsonParsed['_startupFile']),
	// 		new AliasesFile(profileJsonParsed['_aliasesFile']),
	// 		new StartupCommandsFile(profileJsonParsed['_startupCommandsFile']),
	// 		profileJsonParsed['_extensions']);
	//
	//
	// 	assert.strictEqual(profile.id, profileJsonParsed['_id'])
	// 	assert.strictEqual(profile.name, profileJsonParsed['_name'])
	// 	assert.strictEqual(profile.isActive, profileJsonParsed['_isActive'])
	// 	assert.strictEqual(profile.ps1, profileJsonParsed['_ps1'])
	// 	assert.strictEqual(profile.pathsFile, profileJsonParsed['_pathsFile'])
	// 	assert.strictEqual(profile.aliasesFile, profileJsonParsed['_aliasesFile'])
	// 	assert.strictEqual(profile.startupFile, profileJsonParsed['_startupFile'])
	// 	assert.strictEqual(profile.startupCommandsFile, profileJsonParsed['_startupCommandsFile'])
	// 	assert.strictEqual(profile.extensions, profileJsonParsed['_extensions'])
	// });
	//
	// it('simple profile - calculate correct paths', () => {
	// 	const profileJson: string = fs.readFileSync('test/samples/test-profile-1.json', 'utf8');
	// 	const profileJsonParsed: any = JSON.parse(profileJson);
	// 	const profile: Profile = Profile.restore(
	// 		profileJsonParsed['_id'],
	// 		profileJsonParsed['_name'],
	// 		profileJsonParsed['_isActive'],
	// 		profileJsonParsed['_ps1'],
	// 		new PathsFile(profileJsonParsed['_pathsFile']),
	// 		new StartupFile(profileJsonParsed['_startupFile']),
	// 		new AliasesFile(profileJsonParsed['_aliasesFile']),
	// 		new StartupCommandsFile(profileJsonParsed['_startupCommandsFile']),
	// 		profileJsonParsed['_extensions']);
	//
	//
	// 	const actualPaths = Profile.calculatePaths(profile.pathsFile, profile.extensions);
	// 	if (profile.pathsFile == null) {
	// 		throw new Error('Paths file is null')
	// 	}
	// 	const expectedPathsFile = new PathsFile(profile.pathsFile);
	// 	assert.deepStrictEqual(actualPaths,expectedPathsFile.paths, 'paths arent equal')
	//
	// });
});
