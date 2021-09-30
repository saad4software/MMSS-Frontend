<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">
            {{ title }}
          </v-card-title>
          <v-form
            @submit.prevent="submitForm"
            ref="form"
          >


            <v-card-text>

              <v-autocomplete
                v-model="form.employee"
                :loading="loading"
                :items="employees_items"
                :search-input.sync="search_employees"
                item-text="name"
                item-value="id"
                cache-items
                flat
                hide-no-data
                :label="$t('Employee')"
              ></v-autocomplete>

              <v-autocomplete
                v-model="form.project"
                :loading="loading"
                :items="projects_items"
                :search-input.sync="search_projects"
                item-text="name"
                item-value="id"
                cache-items
                flat
                hide-no-data
                :label="$t('Project')"
              ></v-autocomplete>

              <v-autocomplete
                v-model="form.space"
                :loading="loading"
                :items="spaces_items"
                :search-input.sync="search_spaces"
                item-text="name"
                item-value="id"
                cache-items
                flat
                hide-no-data
                :label="$t('Space')"
              ></v-autocomplete>

              <v-slider
                class="mt-5"
                v-model="form.ratio"
                :label="$t('Ratio')"
                thumb-label="always"
                min="0"
                max="25"
              ></v-slider>


              <v-text-field
                :label="$t('Thresh')"
                v-model="form.thresh"
                clearable
                required
              ></v-text-field>



              <v-textarea :label="$t('Notes')" clearable v-model="form.notes"></v-textarea>


              <v-checkbox
                v-model="form.isActive"
                label="Active?"
              ></v-checkbox>

            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                type="submit"
              >
                {{ btn }}
              </v-btn>
            </v-card-actions>

          </v-form>

        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackShow">
      {{ snackText }}
      <template v-slot:action = "{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackShow = false"
        >
          {{$t('Close')}}
        </v-btn>
      </template>
    </v-snackbar>

  </div>


</template>

<script>
export default {

  data() {
    return {

      id: this.$route.params.id ,


      title:'',
      btn: '',

      snackText: '',
      snackShow: false,
      date_menu: false,

      employees_items: [],
      projects_items:[],
      spaces_items:[],
      loading: false,
      search_employees: null,
      search_projects: null,
      search_spaces: null,



      rules: {
        required: value => !!value || this.$t('Required'),
        required_number: value => /^\d+$/.test(value) || this.$t('Required_number'),
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      },


      form: {
        id: null,
        thresh: null,
        ratio: null,
        space: null,
        notes: null,
        employee: null,
        project: null,
        isActive: true,
      }
    }
  },



  watch: {
    search_employees (val) {
      val && val !== this.select && this.queryEmployees(val)
    },
    search_projects (val) {
      val && val !== this.select && this.queryProjects(val)
    },
    search_spaces (val) {
      val && val !== this.select && this.querySpaces(val)
    },
  },

  mounted() {
    console.log(this.id)
    this.title = this.id <= 0 ? this.$t('Add_Ratio') : this.$t('Edit_Ratio')
    this.btn = this.id <= 0 ? this.$t('Add') : this.$t('Edit')

    if(this.id>0){
      this.getItem()
    }
  },

  methods: {
    submitForm(){
      if (this.$refs.form.validate()) {
        if (this.id <= 0) this.createItem()
        else this.editItem()
      }

    },
    createItem(){
      if (this.form.thresh === '') this.form.thresh=null

      this.$axios.$post('ratios/new/', this.form)
        .then(response => {
          this.$router.replace(this.localePath('/ratios'))

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true


        })
    },

    editItem(){
      if (this.form.thresh === '') this.form.thresh=null

      this.$axios.$put('ratios/'+this.form.id+'/', this.form)
        .then(response => {
          this.$router.replace(this.localePath('/ratios'))

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true
        })
    },

    getItem(){
      this.$axios.$get('ratios/'+this.id+'/')
        .then(response => {
          this.form = response.data
          this.queryEmployees(response.data.employeeName)
          this.queryProjects(response.data.projectName)

        })
        .catch((e)=>{
          this.$router.replace(this.localePath('/ratios/0'))
        })

    },

    queryEmployees(v){
      this.loading = true
      this.$axios.$get('employees/?is_active=true&page_size=5&search='+v)
        .then(response => {
          this.loading = false

          this.employees_items = response.data.results

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true
          this.loading = false

        })
    },
    queryProjects(v){
      this.loading = true
      this.$axios.$get('projects/?is_active=true&page_size=5&search='+v)
        .then(response => {
          this.loading = false

          this.projects_items = response.data.results

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true
          this.loading = false

        })
    },

    querySpaces(v){
      this.loading = true
      this.$axios.$get('spaces/?is_active=true&page_size=5&search='+v)
        .then(response => {
          this.loading = false

          this.spaces_items = response.data.results

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true
          this.loading = false

        })
    }

  }
}
</script>

<style scoped>

</style>
