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
	let client;
  try {
    client = new pg.Client(conString);
  } catch (err) {
    console.error(`
Error creating pg Client.
Connection Params:
\tHost: ${pgConfig.host}
\tPort: ${pgConfig.port}
\tUsername: ${pgConfig.username}
\tPassword: ${pgConfig.password}
\tDatabase: ${pgConfig.db}
Error: ${err}
Stack: ${err.stack}
`);
    throw err;
  }
	return client.connect()
  .then(() => usageFn(client)
    .catch(err => console.error(`Error during business logic.\nError: ${err}\nStack: ${err.stack}`))
		.then(v => {
			client.end();
			return v;
		})
    .catch(err => console.error(`Error closing connection.\nError:${err}\nStack: ${err.stack}`))
  )
  .catch(err => console.error(`Error during pg connection.\nConnection string: ${conString}\nError: ${err}\nStack: ${err.stack}`));
}
