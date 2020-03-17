<template>
  <div>
    <v-row class="remove-margin container" style="width: 100vw;">
      <v-col xs="12" sm="12" md="12" lg="12" xl="12">
        <h1 class="display-2 pb-5">This app uses Google Vision API</h1>
      </v-col>

      <SimpleUpload />
    </v-row>
  </div>
</template>

<script>
import SimpleUpload from '@/components/SimpleUpload';

export default {
  name: 'Home',
  components: { SimpleUpload },
};
</script>

<style lang="scss" scoped></style>
