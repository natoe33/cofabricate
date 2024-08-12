<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";

const appStore = useAppStore();
const { login, nostr } = storeToRefs(appStore);

function keyLogin() {}

function nip07Login() {
  nostr.value.login("nip07");
}
</script>
<template>
  <v-dialog v-model="login" width="auto">
    <v-card max-width="400">
      <v-card-title>
        <span class="text-h5">Log In to Nostr</span>
      </v-card-title>
      <v-form class="mx-auto" min-width="300">
        <v-responsive class="mx-auto" max-width="344">
          <v-text-field
            label="Nostr Address"
            placeholder="nsec/npub/hex..."
            append-icon="mdi-send"
            @click:append="keyLogin"
          ></v-text-field>
        </v-responsive>
        <v-card-item
          ><v-btn class="bg-primary" @click="nip07Login"
            >Browser Extension🔐</v-btn
          ></v-card-item
        >
        <v-card-item
          ><v-btn class="bg-secondary">nsecBunker 🔐</v-btn></v-card-item
        >
      </v-form>
    </v-card>
  </v-dialog>
</template>
