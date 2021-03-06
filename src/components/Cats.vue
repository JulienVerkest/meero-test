<template>
  <div>
    <b-container fluid>
      <b-navbar toggleable="md" type="dark" variant="primary">
        <b-navbar-brand href="#">THE CAT WEBSITE</b-navbar-brand>
          <b-navbar-nav>
            <b-nav-item-dropdown
              id="nav7_ddown"
              text="Filtre par origine"
              extra-toggle-classes="nav-link-custom"
              right
            >
              <b-dropdown-item @click="filterByOrigin('all')">Voir tous</b-dropdown-item>
              <b-dropdown-item v-for="origin in filters" @click="filterByOrigin(origin.id)">{{origin.origin}}</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
      </b-navbar>
    </b-container fluid>
    <b-container class="mt-4">
      <b-card-group v-for="cats in groupCats" deck>
        <b-card v-for="(cat, i) in cats" :title="cat.name" :img-src="cat.thumbnail" img-alt="" img-top tag="article" style="max-width: 20rem;" class="mb-2" >
          <b-card-text>
            {{cat.origin}}
          </b-card-text>
          <b-button class="btn btn-primary float-right" @click="popup(cat)">Détails</b-button> 
        </b-card>
      </b-card-group>

      <b-modal id="catmodal" ref="catmodal" title="Détail du chat" size="lg">
        <b-row>
          <b-col>
            <b-img :src="selectedCatThumbnail" fluid alt="" />
          </b-col>
          <b-col>
            <h2>{{selectedCatName}}</h2>
            <p>{{selectedCatDescription}}</p>
          </b-col>
        </b-row>
      </b-modal>
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
        groupCats: [], // all cats with filters
        allCats: [], // all cats without filter
        filters:[], // all countries
        filterOrigin: '', // country origin filter
        selectedCatName: '',
        selectedCatThumbnail: '',
        selectedCatDescription: ''
      }
    },
    mounted() {
      this.listCats()
    },
    methods: {
      popup (cat) {
        this.selectedCatThumbnail = cat.thumbnail
        this.selectedCatName = cat.name
        this.selectedCatDescription = cat.description
        this.$refs.catmodal.show()
      },
      filterByOrigin (code) {
        this.filterOrigin = code
        if(this.filterOrigin === 'all') {
          this.groupCats = _.chunk(this.allCats, 3)
        }
        else {
          this.groupCats = _.chunk(_.filter(this.allCats, { 'country_code': this.filterOrigin}), 3)
        }
      },
      async listCats () {
        try {
          const data = await axios.get('https://api.thecatapi.com/v1/breeds', {'x-api-key': '065ec24f-44b5-4ddb-8090-bb36eb150183'})
          let that = this

          // Create filters
          _.each(data.data, function(cat) {
            that.filters.push({id: cat.country_code, origin: cat.origin})
          })
          that.filters = _.uniqWith(that.filters, _.isEqual)

          // Thumbnail, Description
          Promise.all(data.data.map(cat => {
            return this.details(cat)
          })).then(details => {
              _.each(details, function(cat, i) {
                if(cat) {
                  data.data[i].thumbnail = cat.thumbnail
                  data.data[i].description = cat.description
                }
              })
            this.groupCats = _.chunk(data.data, 3)
            this.allCats = data.data
          })
        } catch (err) {
          console.error('Error API CAT', err);
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
          console.error('Error wikipedia', err)
        }
      }
    },
    watch: {
      '$route.meta' ({showModal}) {
        this.showModal = showModal
      }
    }
  }
</script>
<style>
.card-img-top {
  overflow:hidden;
}
</style>