<script setup lang="ts">
const img = ref("https://picsum.photos/800/500");
</script>
<template>
  <v-container class="fill-height mt-5">
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Consequat id porta
        nibh venenatis cras sed felis eget. Fermentum et sollicitudin ac orci
        phasellus egestas tellus rutrum tellus. Lobortis mattis aliquam faucibus
        purus in massa tempor nec. In nisl nisi scelerisque eu ultrices vitae.
        Dui sapien eget mi proin sed libero enim. Pharetra massa massa ultricies
        mi quis. Quam viverra orci sagittis eu volutpat odio. Et malesuada fames
        ac turpis egestas integer eget. Tellus elementum sagittis vitae et leo.
        Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque.
        Nulla posuere sollicitudin aliquam ultrices sagittis orci a scelerisque
        purus.
      </p>
      <!-- <v-img class="mb-4" height="150" :src="img" /> -->
      <v-img class="mb-4" :src="img" />
      <p>
        Imperdiet dui accumsan sit amet nulla. At erat pellentesque adipiscing
        commodo elit at. Eu mi bibendum neque egestas. Leo vel orci porta non
        pulvinar neque laoreet. Quam pellentesque nec nam aliquam sem et tortor
        consequat. Blandit volutpat maecenas volutpat blandit. Praesent semper
        feugiat nibh sed pulvinar proin gravida hendrerit lectus. Malesuada
        proin libero nunc consequat interdum. Risus pretium quam vulputate
        dignissim. Sollicitudin nibh sit amet commodo nulla. Et netus et
        malesuada fames ac turpis egestas sed. Enim sed faucibus turpis in eu mi
        bibendum neque. Blandit massa enim nec dui nunc. Aliquam ultrices
        sagittis orci a scelerisque purus. Pharetra diam sit amet nisl suscipit
        adipiscing bibendum. Lorem donec massa sapien faucibus et molestie. Enim
        tortor at auctor urna nunc id cursus metus. A erat nam at lectus urna
        duis convallis convallis. Tempor id eu nisl nunc mi ipsum.
      </p>
    </v-responsive>
  </v-container>
</template>
