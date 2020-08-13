<template>
  <v-dialog
    ref="myDialog"
    :value="value"
    :persistent="persistent"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    max-width="1736px"
    @input="update($event)"
  >
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        :class="$slots.subtitle ? 'pb-6' : ''"
      >
        <slot name="title">
          Header
        </slot>
      </v-card-title>
      <v-card-subtitle :class="$slots.subtitle ? 'mt-n6' : ''">
        <slot name="subtitle" />
      </v-card-subtitle>

      <v-card-text>
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
  </v-dialog>
</template>

<script>
export default {
  name: 'MyDialog',
  props: {
    value: {
      type: Boolean,
      default: true,
    },

    persistent: {
      type: Boolean,
      default: true,
    },

  },
  data: () => ({
  }),
  methods: {
    update(v) {
      this.$emit('input', v);
    },
  },
};
</script>

<style scoped>

</style>
