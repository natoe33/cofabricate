import { get as getStore } from 'svelte/store';
import { ndk as ndkStore } from '$lib/stores/nostr';
import GetUserParams, { type NDKUserParams } from '@nostr-dev-kit/ndk';
// import { liveQuery, type Observable } from 'dexie';
import { browser } from '$app/environment';
// import { db } from '$lib/interfaces/db';

const UserInterface = {
	//get: (opts: GetUserParams): Observable<App.UserProfile> => {
	get: (opts: NDKUserParams): App.UserProfile => {
		const ndk = getStore(ndkStore);
		const user = ndk.getUser(opts);
		console.log('get user', opts);
		let userProfile = { ...(user.profile || {}), id: user.pubkey };
		user.fetchProfile().then(async () => {
			userProfile = { ...userProfile, ...(user.profile || {}) };
		});
		return userProfile;
	}
};

export default UserInterface;
