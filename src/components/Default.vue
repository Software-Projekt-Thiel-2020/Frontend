<template>
  <div class="gradientBackground">
    <v-container>
      <h1
        class="my-5 text-center font-weight-light"
        :class="$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-2'"
      >
        {{ title }}
      </h1>
      <v-divider class="my-5" />

      <v-layout
        v-if="loading"
        justify-center
      >
        <v-progress-circular
          :size="70"
          :width="7"
          color="green"
          indeterminate
          class="mt-24"
        />
      </v-layout>
      <slot v-else />
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'DefaultVue',
  props: {
    title: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
  .gradientBackground {
    background: rgb(255, 255, 255) linear-gradient(to right, rgb(199, 255, 212), rgb(176, 218, 255));
    height: 100%;
  }
</style>
