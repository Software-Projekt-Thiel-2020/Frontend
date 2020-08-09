<template>
  <v-card elevation="10">
    <v-img
      v-if="this.$props.imgSrc"
      class="white--text align-end grey lighten-2"
      height="300px"
      width="100%"
      :src="imgSrc ? imgSrc : require(`@/assets/placeholder.png`)"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="grey darken-5"
          />
        </v-row>
      </template>
    </v-img>

    <v-card-title>
      <slot name="title">
        Header
      </slot>
    </v-card-title>
    <v-card-subtitle>
      <slot name="subtitle" />
    </v-card-subtitle>

    <v-card-text class="text--primary">
      <slot name="text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </slot>
    </v-card-text>

    <v-divider v-if="this.$slots.actions" />

    <v-card-actions>
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'MyCard',
  props: {
    imgSrc: {
      type: String,
      default: null,
    },
  },
};
</script>

<style scoped>

</style>
