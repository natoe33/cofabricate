import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";
import { LoginMethod } from "./nostr";

const appStore = useAppStore();
const { nostr, currentUser } = storeToRefs(appStore);

export async function browserSetup() {
  const pubkey = localStorage.getItem("pubkey");
  const method = localStorage.getItem("nostr-key-method");
  const ndk = nostr.value.ndk;
  console.log(`browserSetup pubkey: ${pubkey}, method: ${method}`);

  if (pubkey) {
    const u = ndk.getUser({ pubkey });
    u.fetchProfile();
    nostr.value.loginState = "logging-in";
    currentUser.value = u;
  }

  // if (!pubkey && method !== "none") return nostr.value.login("nip07");

  if (method && pubkey) {
    console.debug(`logging in with ${method} as ${pubkey}`);
    return nostr.value.login(method as LoginMethod);
  }
}
