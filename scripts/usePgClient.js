import pg from 'pg';

const userPwdLookup = {
	"postgres": "docker",
	"tank_data_injector": "tankDataInjector"
};


export default function usePgClient(username, usageFn) {
	const pwd = userPwdLookup[username];
	if (pwd === undefined) {
		console.error(`Unknown username: ${username}`);
		process.exit(1);
	}
	const pgConfig = {
		host: '192.168.50.53',
		port: 5432,
		username,
		password: pwd,
		db: 'tank_data'
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
