import {Profile} from "../src/profile/Profile";
import fs from "fs";
import {PathsFile} from "../src/file/PathsFile";
import {StartupFile} from "../src/file/StartupFile";
import {AliasesFile} from "../src/file/AliasesFile";
import {StartupCommandsFile} from "../src/file/StartupCommandsFile";

describe('Array', () => {
	describe('#indexOf()', () => {
		it('should return -1 when the value is not present', () => {
			try{
				const profileJson: string = fs.readFileSync('test/samples/test-profile-1.json', 'utf8');
				const profileJsonParsed: any = JSON.parse(profileJson);
				const profile: Profile = Profile.restore(
					profileJsonParsed['_id'],
					profileJsonParsed['_name'],
					profileJsonParsed['_isActive'],
					profileJsonParsed['_ps1'],
					new PathsFile(profileJsonParsed['_pathsFile']),
					new StartupFile(profileJsonParsed['_startupFile']),
					new AliasesFile(profileJsonParsed['_aliasesFile']),
					new StartupCommandsFile(profileJsonParsed['_startupCommandsFile']),
					profileJsonParsed['_extensions']);

				console.log(profile);
			}
			catch (e){
				console.log(e);
			}
		});
	});
});
