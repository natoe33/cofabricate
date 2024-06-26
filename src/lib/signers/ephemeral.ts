import NDK, { NDKEvent, NDKPrivateKeySigner, type NDKFilter, type NDKSigner, type NDKUserProfile } from "@nostr-dev-kit/ndk";
import type { NDKTag, NostrEvent} from "@nostr-dev-kit/ndk";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";

const CURRENT_PRIVATE_NOTE_VERSION = '2';

interface IFindEphemeralSignerLookups {
    name?: string,
    associatedEventNip19?: string;
}

/**
 * Find a named ephemeral signer from a self-DM.
 */
export async function findEphemeralSigner(
    ndk: NDK,
    mainSigner: NDKSigner,
    opts: IFindEphemeralSignerLookups
): Promise<NDKPrivateKeySigner | undefined> {
    const mainUser = await mainSigner.user();
    const filter: NDKFilter = { kinds: [2600 as number]};

    if (opts.name) {
        const hashedName = await getHashedKeyName(opts.name);
        filter['#e'] = [hashedName];
    } else if (opts.associatedEventNip19) {
        const hashedEventReference = await getHashedKeyName(opts.associatedEventNip19);
        filter['#e'] = [hashedEventReference];
    }

    const event = await ndk.fetchEvent(filter);

    if (event) {
        const decryptEventFunction = async (event: NDKEvent) => {
            await event.decrypt(await mainSigner.user());
            const content = JSON.parse(event.content);
            return new NDKPrivateKeySigner(content.key);
        };

        const promise = new Promise<NDKPrivateKeySigner>((resolve, reject) => {
            let decryptionAttempts = 0;
            try {
                decryptionAttempts++;
                resolve(decryptEventFunction(event));
            } catch(e) {
                if (decryptionAttempts> 5) {
                    console.error(`Failed to decrypt ephemeral signer event after ${decryptionAttempts} attempts`);
                    reject(e);
                    return;
                }
                setTimeout(() => { decryptEventFunction(event);}, 1000 * Math.random());
            }
        });
        return promise;
    }
}

type EphemeralKeyEventContent = {
    key: string;
    event?: string;
    version: string;
    metadata?: object;
}

interface ISaveOpts {
    associatedEvent?: NDKEvent;
    name?: string;
    metadata?: object;
    keyProfile?: NDKUserProfile;
    mainSigner?: NDKSigner;
}

function generateContent(targetSigner: NDKPrivateKeySigner, opts: ISaveOpts = {}) {
    const content: EphemeralKeyEventContent = {
        key: targetSigner.privateKey!,
        version: CURRENT_PRIVATE_NOTE_VERSION,
        ...opts.metadata,
    };
    if (opts.associatedEvent) content.event = opts.associatedEvent.encode();

    return JSON.stringify(content);
}

async function getHashedKeyName(name:string) {
    let eventHash = sha256(name);
    return bytesToHex(eventHash);
}

async function generateTags(mainSigner:NDKSigner, opts: ISaveOpts = {}) {
    const mainUser = await mainSigner.user();
    const tags = [
        ['p', mainUser.pubkey],
        ['client', 'cofabricate'],
    ]

    if (opts.associatedEvent) {
        const hashedEventReference = await getHashedKeyName(opts.associatedEvent.encode());
        tags.push(['e', hashedEventReference]);
    }

    if (opts.name) {
        const hashedName = await getHashedKeyName(opts.name);
        tags.push(['e', hashedName]);
    }

    return tags;
}

export async function saveEphemeralSigner(ndk: NDK, targetSigner: NDKPrivateKeySigner, opts: ISaveOpts = {}) {
    const mainSigner = opts.mainSigner || ndk.signer;

    if (!mainSigner) throw new Error('No main signer provided');

    const mainUser = await mainSigner.user();
    const event = new NDKEvent(ndk, {
        kind: 2600,
        content: generateContent(targetSigner, opts),
        tags: await generateTags(mainSigner, opts),
    } as NostrEvent);

    event.pubkey = mainUser.pubkey;
    await event.encrypt(mainUser, mainSigner);
    await event.publish();

    if (opts.keyProfile) {
        const user = await targetSigner.user();
        const event = new NDKEvent(ndk, {
            kind: 0,
            content: JSON.stringify(opts.keyProfile),
            tags: [] as NDKTag[],
        } as NostrEvent)
        event.pubkey = user.pubkey;
        await event.sign(targetSigner);
        await event.publish();
    }
}

export function generateEphemeralSigner(): NDKPrivateKeySigner {
    const signer = NDKPrivateKeySigner.generate();
    return signer;
}