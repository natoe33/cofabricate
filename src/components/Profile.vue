<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";

const appStore = useAppStore();
const {currentUser} = storeToRefs(appStore);

</script>
<template>
    <p>{{ currentUser?.profile?.about }}</p>
    <p>{{ currentUser?.profile?.bio }}</p>
</template>