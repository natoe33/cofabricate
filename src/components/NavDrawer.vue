<script setup lang="ts">
import { NDKUser } from "@nostr-dev-kit/ndk";
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";

const appStore = useAppStore();
const { login, nostr, currentUser, drawer } = storeToRefs(appStore);
const router = useRouter();
let random = (Math.random() + 1).toString(36).substring(6);
const defaultImage = ref();
const title = ref();
const subtitle = ref();

watch(currentUser, async (user: NDKUser | null) => {
  if (user && user.profile) {
    title.value = user.profile.displayName
      ? user.profile.displayName
      : user.profile.name;
    subtitle.value = user.profile.nip05
      ? user.profile.nip05
      : user.profile.name;
    defaultImage.value = user.profile.image
      ? user.profile.image
      : `https://robohash.org/${random}`;
  } else {
    title.value = "Test User";
    subtitle.value = "test@cofabricate";
    defaultImage.value = `https://robohash.org/${random}`;
  }
});

onMounted(() => {
  title.value = "Test User";
  subtitle.value = "test@cofabricate";
  defaultImage.value = `https://robohash.org/${random}`;
});

function handleHome() {
  router.push("/");
}

function handleClick() {
  console.log(nostr.value.loginState);

  if (nostr.value.loginState !== "logged-in") {
    login.value = !login.value;
  } else {
    if (currentUser.value?.profile?.name) {
      router.push(`/${encodeURIComponent(currentUser.value.profile.name)}`);
    }
  }
}
</script>
<template>
  <!-- <v-navigation-drawer :width="150" v-model="drawer" temporary> -->
  <v-navigation-drawer v-model="drawer" :width="200" temporary>
    <v-list nav>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Home"
        value="home"
        @click="handleHome"
      ></v-list-item>
      <v-list-item
        :prepend-avatar="defaultImage"
        :title="title"
        :subtitle="subtitle"
        @click="handleClick"
      ></v-list-item>
      <v-divider></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>
