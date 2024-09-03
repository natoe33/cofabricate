<template>
  <head>
    <title>{{ name }}</title>
  </head>
  <Profile />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";

const router = useRouter();
const route = useRoute('/[name]');

const appStore = useAppStore();
const { currentUser } = storeToRefs(appStore);
const name = ref();

watch(currentUser, async (user) => {
    name.value = user?.profile?.name;
})

</script>