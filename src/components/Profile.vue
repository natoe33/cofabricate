<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";

const appStore = useAppStore();
const { currentUser } = storeToRefs(appStore);
</script>
<template>
  <v-container>
    <v-card>
      <v-container>
        <v-img
          height="100%"
          :src="currentUser?.profile?.banner"
          cover
          no-gutters
        >
          <v-avatar size="x-large">
            <v-img :src="currentUser?.profile?.image" cover></v-img>
          </v-avatar>
        </v-img>
      </v-container>
      <v-card-title class="text-h5 font-weight-bold">{{
        currentUser?.profile?.displayName
      }}</v-card-title>
      <v-card-text>
        <v-row align="left" no-gutters>
          <p>{{ currentUser?.profile?.nip05 }}</p>
        </v-row>
        <v-row align="left" no-gutters>
          <v-icon icon="mdi-link"></v-icon>
          <p class="pl-2">{{ currentUser?.profile?.website }}</p>
        </v-row>
        <v-row align="left" no-gutters>
          <v-icon icon="mdi-lightning-bolt-circle"></v-icon>
          <p class="pl-2">{{ currentUser?.profile?.lud16 }}</p>
        </v-row>
      </v-card-text>
      <v-card-text>
        <p class="text-body-1">{{ currentUser?.profile?.about }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>
