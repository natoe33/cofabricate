import debug from "debug";
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import NDK, {
  Hexpubkey,
  NDKConstructorParams,
  NDKNip07Signer,
  NDKNip46Signer,
  NDKPrivateKeySigner,
  NDKUser,
} from "@nostr-dev-kit/ndk";

const explicitUrls: string[] = [
  "wss://relay.damus.io",
  "wss://eden.nostr.land",
  "wss://relay.nostr.band",
];

const devRelays: string[] = import.meta.env.DEV
  ? ["wss://relay.strfront.com"]
  : [];

export type LoginMethod = "none" | "pk" | "nip07" | "nip46";
export type LoginState =
  | "logging-in"
  | "logged-in"
  | "contacting-remote-signer"
  | "logged-out"
  | null;

export class Nostr {
  ndk: NDK;
  bunkerNDK: NDK;
  debug: debug.Debugger;
  loginState: LoginState;

  constructor() {
    this.loginState = "logged-out";
    this.ndk = this.initialize();
    this.bunkerNDK = this.initializeBunker();
    this.debug = debug("ndk");
  }

  initialize(): NDK {
    const params: NDKConstructorParams = {
      devWriteRelayUrls: devRelays,
      explicitRelayUrls: explicitUrls,
      enableOutboxModel: true,
      clientName: "cofabricate",
    };
    this.ndk = new NDK(params);
    this.ndk.connect();
    return this.ndk;
  }

  initializeBunker(): NDK {
    const params: NDKConstructorParams = {
      explicitRelayUrls: [
        ...explicitUrls,
        "wss://relay.nsecbunker.com",
        "wss://nostr.vulpem.com",
      ],
      enableOutboxModel: true,
      clientName: "cofabricate",
    };
    this.bunkerNDK = new NDK(params);
    this.bunkerNDK.connect();
    return this.bunkerNDK;
  }

  async login(
    method: LoginMethod,
    userPubkey?: string
  ): Promise<NDKUser | null> {
    // console.debug(`logging in with ${method}`);

    switch (method) {
      case "none":
        this.loginState = null;
        return null;
      case "pk":
        return await this.pkLogin();
      case "nip07":
        return await this.nip07Login();
      case "nip46":
        return await this.nip46Login(userPubkey);
      default:
        const promise = new Promise<NDKUser | null>((resolve) => {
          let loadAttempts = 0;
          const loadNip07Interval = setInterval(async () => {
            if (window.nostr) {
              clearInterval(loadNip07Interval);
              const user = await this.nip07Login();
              resolve(user);
            }
            if (loadAttempts++ > 10) clearInterval(loadNip07Interval);
          }, 100);
        });
        return promise;
    }
  }

  private async pkLogin(): Promise<NDKUser | null> {
    const key: string | null = localStorage.getItem("nostr-key");
    if (!key) return null;
    else return await this.pkSignin(key);
  }

  private async pkSignin(key: string): Promise<NDKUser | null> {
    this.ndk.signer = new NDKPrivateKeySigner(key);
    const user = await this.ndk.signer.user();
    if (user) await this.loggedIn(user!, "pk");
    return user;
  }

  private async nip07Login(): Promise<NDKUser | null> {
    const storedNpub: string | null = localStorage.getItem("pubkey");
    let user: NDKUser | null = null;

    if (storedNpub) {
      user = new NDKUser({ npub: storedNpub });
      user.ndk = this.ndk;
      console.debug(`Nip07 - logging in with stored npub ${storedNpub}`);
    }

    if (window.nostr) {
      try {
        this.ndk.signer = new NDKNip07Signer();
        user = await this.ndk.signer.blockUntilReady();
        if (user) await this.loggedIn(user!, "nip07");
      } catch (error) {
        console.error(`Nip07 login error ${error}`);
      }
    }
    return user;
  }

  private async nip46Login(remotePubkey?: Hexpubkey): Promise<NDKUser | null> {
    const existingPrivateKey = localStorage.getItem("nostr-nsecbunker-key");
    let remoteUser: NDKUser | null = null;
    let user: NDKUser | null = null;

    if (!existingPrivateKey) return null;
    if (remotePubkey) remoteUser = this.ndk.getUser({ pubkey: remotePubkey });
    if (!remoteUser) return null;

    this.bunkerNDK.pool.on("relay:ready", async () => {
      console.debug("bunker relay ready");
      this.loginState = "contacting-remote-signer";
      user = await this.nip46SignIn(existingPrivateKey, remoteUser);
    });
    return user;
  }

  private async nip46SignIn(
    existingPrivateKey: string,
    remoteUser: NDKUser
  ): Promise<NDKUser | null> {
    let user: NDKUser | null = null;
    remoteUser.ndk = this.bunkerNDK;
    let localSigner: NDKPrivateKeySigner | null = null;
    if (existingPrivateKey)
      localSigner = new NDKPrivateKeySigner(existingPrivateKey);
    else {
      alert("Local signer not available");
      return null;
    }
    const remoteSigner = new NDKNip46Signer(
      this.bunkerNDK,
      remoteUser.pubkey,
      localSigner!
    );
    this.ndk.signer = remoteSigner;
    console.debug("Contacting remote signer");
    user = await remoteSigner.blockUntilReady();
    console.debug("Remote signer connected");

    if (user) await this.loggedIn(remoteUser, "nip46");
    return user;
  }

  private async loggedIn(u: NDKUser, method: LoginMethod) {
    // signer should be set prior
    // set ndk user and currentUser
    // set localStorage items

    const appStore = useAppStore();
    const { currentUser, login } = storeToRefs(appStore);
    u.ndk = this.ndk;
    await u.fetchProfile();
    currentUser.value = u;
    this.ndk.activeUser = u;
    // console.debug(`DEBUG setting current user (loggedIn): ${u}`);
    this.loginState = "logged-in";
    login.value = false;
    localStorage.setItem("pubkey", u.pubkey);
    localStorage.setItem("nostr-key-method", method);
    sessionStorage.setItem("user", JSON.stringify(u));
  }

  private async createEvent() {}
}
