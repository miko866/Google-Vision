<template>
  <div>
    <v-row class="pl-5">
      <!-- START Upload image -->
      <v-col cols="12" sm="12" md="6" lg="6" xl="6" style="padding-left: unset;">
        <form @submit.prevent="sendFile" enctype="multipart/form-data">
          <div class="field">
            <div>
              <label class="file-label">
                <input
                  type="file"
                  ref="image"
                  @change="selectFile"
                  class="file-input"
                  accept="image/png, image/jpeg, image/jpg"
                />
                <span class="file-cta">
                  <v-icon large color="deep-purple  darken-2">mdi-arrow-up-bold-box-outline</v-icon>
                  <span class="file-label pl-5">
                    Choose a file...
                  </span>
                </span>

                <span v-if="image" class="file-name pt-3">{{ image.name }}</span>

                <!-- START Image preview local -->
                <v-img
                  v-if="imageBase"
                  :src="imageBase"
                  height="300"
                  width="400"
                  aspect-ratio="2"
                  contain
                  style="margin-top: 1em;"
                />
                <!-- END Image preview local -->
              </label>
            </div>
          </div>

          <div class="field my-2 pt-5">
            <v-btn color="primary" @click="sendFile">Send</v-btn>
          </div>
        </form>
      </v-col>
      <!-- END Upload image -->

      <!-- START Show Tabel -->
      <v-col cols="12" sm="12" md="6" lg="6" xl="6" style="padding-left: unset;" v-if="items.length !== 0">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td>{{ item.description }}</td>
                <td>{{ (item.score * 100).toFixed(2) }} %</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <!-- END Show Tabel -->
    </v-row>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      image: '',
      imageBase: '',
      items: [],
    };
  },

  methods: {
    selectFile() {
      this.image = this.$refs.image.files[0];

      // create a new FileReader to read this image and convert to base64 format
      const fr = new FileReader();
      // Start the reader job - read file as a data url (base64 format)
      fr.readAsDataURL(this.image);
      // Define a callback function to run, when FileReader finishes its job
      fr.addEventListener('load', () => {
        this.imageBase = fr.result;
      });
    },

    async sendFile() {
      const formData = new FormData();

      // For new image name -> temp file
      const currentTime = new Date().toISOString();

      formData.append('file', this.image);

      await axios
        .post('http://localhost:5700/upload', formData, {
          timeout: 50000,
          headers: {
            currenttime: currentTime,
          },
        })
        .then((response) => {
          this.items = response.data.data;
        })
        .catch((err) => {
          console.error('Error upload file', err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import './src/assets/css/components/SimpleUpload.scss';
</style>
