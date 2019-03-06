<template>
  <div>
    <b-container fluid>
      <b-navbar toggleable="md" type="dark" variant="primary">
        <b-navbar-brand href="#">THE CAT WEBSITE</b-navbar-brand>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown
              id="nav7_ddown"
              text="Filtre par origine"
              extra-toggle-classes="nav-link-custom"
              right
            >
              <b-dropdown-item v-for="origin in filters">{{origin.origin}}</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
      </b-navbar>
    </b-container fluid>
    <b-container class="mt-4">
      <b-card-group v-for="cats in groupCats" deck>
        <b-card v-for="(cat, i) in cats" :title="cat.name" :img-src="cat.thumbnail" img-alt="" img-top tag="article" style="max-width: 20rem;" class="mb-2">
          <b-card-text>
            {{cat.origin}}
          </b-card-text>
          <b-button href="#" variant="primary" class="float-right">Détails</b-button>
        </b-card>
      </b-card-group>
    </b-container>
  </div>
</template>
<script>
  import _ from 'lodash'
  import axios from 'axios';
  export default {
    name: 'Cats',
    data () {
      return {
        groupCats: [],
        filters:[] 
      }
    },
    mounted() {
      this.listCats();
    },
    methods: {
      filter (origin) {

      },
      async listCats () {
        try {
          const data = await axios.get('https://api.thecatapi.com/v1/breeds', {'x-api-key': '065ec24f-44b5-4ddb-8090-bb36eb150183'})
          let that = this

          // Filters
          _.each(data.data,function(cat){
            that.filters.push({id: cat.country_code, origin: cat.origin})
          })
          that.filters = _.uniqWith(that.filters, _.isEqual)

          // Thumbnail, Description
          Promise.all(data.data.map(cat => {
            return this.details(cat)
          })).then(details => {
              details.forEach((cat, i) => {
                if(cat) {
                  data.data[i].thumbnail = cat.thumbnail
                  data.data[i].description = cat.description
                }
              });
            this.groupCats = _.chunk(data.data, 3)
          })
        } catch (err) {
          console.error(err);
        }
      },
      async details(cat) {
        try {
          let url_wiki
          let details = {
            thumbnail: '',
            description: ''
          }
          if(cat.wikipedia_url) {
            url_wiki = cat.wikipedia_url.split('/')
            const responseMedia = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/media/${url_wiki[url_wiki.length - 1]}`)
            if (responseMedia.data.items[0] && responseMedia.data.items[0].thumbnail) {
              details.thumbnail = responseMedia.data.items[0].thumbnail.source
            }
            if (responseMedia.data.items[0] && responseMedia.data.items[0].description) {
              details.description = responseMedia.data.items[0].description.text
            }
          }
          return details;
        } catch (err) {
          console.error("Error wikipedia", err);
        }
      }
    }
  }
</script>
<style>
.card-img-top {
  overflow:hidden;
}
</style>