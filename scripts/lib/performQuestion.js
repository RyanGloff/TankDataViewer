import readline from 'readline';
import { fileURLToPath } from 'url';

export default function performQuestion(question) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: true
	});

	return new Promise((resolve, reject) => {
		rl.question(question, answer => resolve(answer));
	}).then(answer => {
		rl.close();
		return answer;
	});
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const question = process.argv[2];
	performQuestion(question)
	.then(answer => console.log(`Answer was: ${answer}`));
}
