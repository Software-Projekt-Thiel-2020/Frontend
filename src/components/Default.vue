<template>
  <div class="gradientBackground">
    <v-container>
      <h1
        class="my-5 text-center font-weight-light"
        :class="$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-2'"
      >
        {{ title }}
      </h1>
      <h3
        v-if="subtitle"
        class="my-n2 text-center font-weight-light"
      >
        {{ subtitle }}
      </h3>
      <v-divider class="my-5" />
      <MyAlertSystem
        ref="alertSystem"
      />

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
import MyAlertSystem from './MyAlertSystem.vue';

export default {
  name: 'DefaultVue',
  components: {
    MyAlertSystem,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
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
    background: rgb(255, 255, 255) linear-gradient(to right, rgba(199, 255, 212, 0.45), rgba(176, 218, 255, 0.9));
    height: 100%;
  }
</style>

<style>
  .btnTitleLeft {
    position: absolute;
    top: 38px;
    right:50px;
  }
</style>
