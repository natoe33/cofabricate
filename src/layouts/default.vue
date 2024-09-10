<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <AppBar />
    <NavDrawer />
    <Login />
  </v-app>
</template>

<script lang="ts" setup>
import { browserSetup } from "@/utils/browser-setup";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const { loginState } = storeToRefs(appStore);

const user = sessionStorage.getItem("user");

onMounted(() => {
  console.log(`loginState: ${loginState.value}\nuser: ${user}`);

  if (!user || loginState.value !== "logged-in") browserSetup();
});
</script>
