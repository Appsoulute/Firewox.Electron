import { EventEmitter } from 'events';
import url from 'url';


const events = new EventEmitter();

const requestLogin = async ({ request, authInfo }) => {
	const { auth } = url.parse(request.url);

	if (auth) {
		const [username, password] = auth.split(':');
		return { username, password };
	}

	return await new Promise((callback) => events.emit('login-requested', { request, authInfo, callback }));
};

const handleLoginEvent = async (event, webContents, request, authInfo, callback) => {
	const credentials = await requestLogin({ request, authInfo });

	if (!credentials) {
		return;
	}

	const { username, password } = credentials;

	if (username && password) {
		event.preventDefault();
		callback(username, password);
	}
};

export const basicAuth = Object.assign(events, {
	requestLogin,
	handleLoginEvent,
});
