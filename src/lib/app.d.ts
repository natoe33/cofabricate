declare global {
	namespace App {
		interface UserProfile {
			id?: string;
			name?: string;
			displayName?: string;
			image?: string;
			banner?: string;
			bio?: string;
			nip05?: string;
			lud16?: string;
			about?: string;
			zapService?: string;
		}
	}
}

export {};
