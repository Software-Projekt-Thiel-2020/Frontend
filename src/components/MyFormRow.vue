<template>
  <v-row>
    <v-col
      cols="12"
      sm="3"
      lg="2"
      xl="1"
    >
      <h4 class="font-weight-medium fromField">
        {{ title + (title ? ':' : '') }}
      </h4>
    </v-col>

    <v-col>
      <slot />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'MyFormRow',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
  .fromField {
    font-size: 1.13em;
  }
</style>
