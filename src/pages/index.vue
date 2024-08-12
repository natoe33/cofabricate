<template>
  <head>
    <title>Decentralized Manufacturing</title>
  </head>
  <Welcome />
</template>

<script lang="ts" setup>
import { browserSetup } from "@/utils/browser-setup";
onMounted(() => {
  browserSetup();
});
</script>
