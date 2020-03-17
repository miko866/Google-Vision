<template>
  <div style="display: flex;">
    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
      <form @submit.prevent="sendFile" enctype="multipart/form-data">
        <div class="field">
          <div class="file">
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

              <!-- Image preview local -->
              <v-img
                v-if="imageBase"
                :src="imageBase"
                height="300"
                width="400"
                aspect-ratio="2"
                contain
                style="margin-top: 1em;"
              />
            </label>
          </div>
        </div>

        <div class="field my-2 pt-5">
          <v-btn color="primary" @click="sendFile">Send</v-btn>
        </div>
      </form>
    </v-col>

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Percent</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>{{ item.description }}</td>
            <td>{{ item.score }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
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
          console.log('response', response.data.data);
          this.items = response.data.data;
          // var result = Object.keys(this.items).map(function(key) {
          //   return [Number(key), this.items[key]];
          // });
          console.log('items', this.items);
        })
        .catch((err) => {
          console.error('Error upload file', err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.file-input {
  display: none;
}

.file-label {
  display: flex;
  flex-direction: column;
}

.file-cta {
  width: 15em;
  display: flex;
  align-items: center;
  background-color: #42a5f5;
  padding: 2em;
  border-top-left-radius: 0.3em;
  border-top-right-radius: 0.3em;
  cursor: pointer;
}

.file-name {
  display: flex;
  width: 15em;
  justify-content: center;
  background-color: #e0e0e0;
  border-bottom-right-radius: 0.3em;
  border-bottom-left-radius: 0.3em;
  padding-bottom: 0.7em;
}
</style>
