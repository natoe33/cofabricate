<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const { drawer } = storeToRefs(appStore);
</script>
<template>
  <v-app-bar flat>
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>CoFabricate</v-app-bar-title>
  </v-app-bar>
</template>
