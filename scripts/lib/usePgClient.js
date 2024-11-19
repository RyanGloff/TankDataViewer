import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const userPwdLookup = {
	"postgres": {
    name: process.env['PG_POSTGRES_USER'],
    password: process.env['PG_POSTGRES_PASSWORD']
  },
	"tank_data_injector": {
    name: process.env['PG_TANK_DATA_INJECTOR_USER'],
    password: process.env['PG_TANK_DATA_INJECTOR_PASSWORD']
  }
};

export default function usePgClient(username, usageFn) {
	const credentials = userPwdLookup[username];
	if (credentials === undefined) {
		console.error(`Unknown username: ${username}`);
		process.exit(1);
	}
	const pgConfig = {
		host: process.env['PG_HOST'],
		port: process.env['PG_PORT'],
		username: credentials.name,
		password: credentials.password,
		db: process.env['PG_DB_NAME']
	};
	const conString = `postgres://${pgConfig.username}:${pgConfig.password}@${pgConfig.host}:${pgConfig.port}/${pgConfig.db}`;
	const client = new pg.Client(conString);
	client.connect();

	const usagePromise = usageFn(client)
		.then(v => {
			client.end();
			return v;
		});

	return usagePromise;
}
