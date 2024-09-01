<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";

const appStore = useAppStore();
const { login, nostr, currentUser, drawer } = storeToRefs(appStore);
let random = (Math.random() + 1).toString(36).substring(6);
let defaultImage = ref(`https://robohash.org/${random}`);
const subtitle = ref("");

onMounted(() => {
  subtitle.value = currentUser
    ? currentUser.value?.profile?.nip05
      ? currentUser.value.profile.nip05
      : currentUser.value?.profile?.name
    : "test@cofabricate";
});

function handleClick() {
  console.log(nostr.value.loginState);

  if (nostr.value.loginState !== "logged-in") {
    login.value = !login.value;
  }
}
</script>
<template>
  <!-- <v-navigation-drawer :width="150" v-model="drawer" temporary> -->
  <v-navigation-drawer v-model="drawer" :width="200">
    <v-list>
      <v-list-item
        :prepend-avatar="defaultImage"
        :subtitle="subtitle"
        title="Test User"
        @click="handleClick"
      ></v-list-item>
      <v-divider></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>
