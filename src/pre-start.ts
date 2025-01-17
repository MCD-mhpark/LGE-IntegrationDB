/**
 * Pre-start is where we want to place things that must run BEFORE the express 
 * server is started. This is useful for environment variables, command-line 
 * arguments, and cron-jobs.
 */

// NOTE: DO NOT IMPORT ANY SOURCE CODE HERE
import path from 'path';
import dotenv from 'dotenv';
import { parse } from 'ts-command-line-args';

//console.log(process.env.NODE_ENV);
// TypeScript pm2 설정시 -r tsconfig-paths/register 옵션이 안먹어서 강제로 설정.
if (process.env.NODE_ENV === 'production') {
       require('module-alias/register');
}
// **** Types **** //

interface IArgs {
  env: string;
}


// **** Setup **** //
//console.log('env:', process.env.NODE_ENV == 'production');
// Command line arguments
const args = parse<IArgs>({
  env: {
    type: String,
    defaultValue: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    alias: 'e',
  },
});
//console.log('args.env>>>>>>>>>>>', args.env);

// Set the env file
const result2 = dotenv.config({
  path: path.join(__dirname, `../env/${args.env}.env`),
});

if (result2.error) {
  throw result2.error;
}
