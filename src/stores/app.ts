// Utilities
import { Nostr } from "@/utils/nostr";
import { LoginState } from "@/utils/utils";
import NDK, { NDKUser } from "@nostr-dev-kit/ndk";
import { defineStore } from "pinia";

type State = {
  nostr: Nostr;
  ndk: NDK | null;
  loginState: LoginState | null;
  currentUser: NDKUser | null;
  drawer: boolean;
  login: boolean;
};

export const useAppStore = defineStore({
  id: "app",
  state: (): State => ({
    nostr: new Nostr(),
    ndk: null,
    loginState: null,
    currentUser: null,
    drawer: false,
    login: false,
  }),
});
