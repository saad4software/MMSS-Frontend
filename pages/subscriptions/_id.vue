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
                v-model="form.employee_owner"
                :loading="loading"
                :items="employees_items"
                :search-input.sync="search_owner"
                item-text="name"
                item-value="id"
                return-object
                cache-items
                flat
                hide-no-data
                :label="$t('Owner')"
              ></v-autocomplete>

              <v-autocomplete
                v-model="form.employees_list"
                :loading="loading"
                :items="employees_items"
                :search-input.sync="search_employees"
                item-text="name"
                item-value="id"
                return-object
                cache-items
                multiple
                chips
                flat
                hide-no-data
                :label="$t('Employees')"
              ></v-autocomplete>

              <v-autocomplete
                v-model="form.spaces_list"
                :loading="loading"
                :items="spaces_items"
                :search-input.sync="search_spaces"
                item-text="name"
                item-value="id"
                return-object
                cache-items
                multiple
                chips
                flat
                hide-no-data
                :label="$t('Spaces')"
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
                v-model="form.client"
                :loading="loading"
                :items="clients_items"
                :search-input.sync="search_clients"
                item-text="name"
                item-value="id"
                cache-items
                flat
                hide-no-data
                :label="$t('Client')"
              ></v-autocomplete>

              <v-text-field
                :label="$t('Amount')"
                v-model="form.amount"
                clearable
                :rules="[rules.required_number]"
              ></v-text-field>

              <v-text-field
                :label="$t('Paper_ID')"
                v-model="form.paper_id"
                clearable
                :rules="[rules.required_number]"
              ></v-text-field>

              <v-menu
                ref="date_from"
                v-model="date_from_menu"
                :close-on-content-click="false"
                :return-value.sync="form.from_date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.from_date"
                    :label="$t('From')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.from_date"
                  no-title
                  scrollable
                >
                  <v-btn
                    text
                    color="primary"
                    @click="date_from_menu = false"
                  >
                    {{$t('Cancel')}}
                  </v-btn>

                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="form.from_date = ''"
                  >
                    {{$t('Clear')}}
                  </v-btn>

                  <v-btn
                    text
                    color="primary"
                    @click="$refs.date_from.save(form.from_date)"
                  >
                    {{$t('OK')}}
                  </v-btn>
                </v-date-picker>
              </v-menu>

              <v-menu
                ref="date_to"
                v-model="date_to_menu"
                :close-on-content-click="false"
                :return-value.sync="form.to_date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.to_date"
                    :label="$t('To')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.to_date"
                  no-title
                  scrollable
                >
                  <v-btn
                    text
                    color="primary"
                    @click="date_to_menu = false"
                  >
                    {{$t('Cancel')}}
                  </v-btn>
                  <v-spacer></v-spacer>

                  <v-btn
                    text
                    color="primary"
                    @click="form.to_date = ''"
                  >
                    {{$t('Clear')}}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.date_to.save(form.to_date)"
                  >
                    {{$t('OK')}}
                  </v-btn>
                </v-date-picker>
              </v-menu>


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
      clients_items:[],
      spaces_items:[],

      loading: false,
      search_employees: null,
      search_owner: null,
      search_projects: null,
      search_clients: null,
      search_spaces: null,

      date_from_menu: false,
      date_to_menu: false,


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
        from_date: null,
        to_date: null,
        amount: null,
        paper_id: null,
        project: null,
        client: null,
        notes: null,
        owner: null,
        employee_owner: null,
        employees: [],
        spaces: [],
        employees_list: [],
        spaces_list:[],
        isActive: true,
      }
    }
  },



  watch: {
    search_employees (val) {
      val && val !== this.select && this.queryEmployees(val)
    },
    search_owner (val) {
      val && val !== this.select && this.queryEmployees(val)
    },
    search_projects (val) {
      val && val !== this.select && this.queryProjects(val)
    },
    search_spaces (val) {
      val && val !== this.select && this.querySpaces(val)
    },
    search_clients (val) {
      val && val !== this.select && this.queryClients(val)
    },
  },

  mounted() {
    console.log(this.id)
    this.title = this.id <= 0 ? this.$t('Add_Subscription') : this.$t('Edit_Subscription')
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

      this.form.employees = this.form.employees_list.map(item=>item.id)
      this.form.spaces = this.form.spaces_list.map(item=>item.id)
      this.form.owner = this.form.employee_owner.id
      this.$axios.$post('subscriptions/new/', this.form)
        .then(response => {
          this.$router.replace(this.localePath('/subscriptions'))

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true


        })
    },

    editItem(){
      this.form.employees = this.form.employees_list.map(item=>item.id)
      this.form.spaces = this.form.spaces_list.map(item=>item.id)
      this.form.owner = this.form.employee_owner.id

      this.$axios.$put('subscriptions/'+this.form.id+'/', this.form)
        .then(response => {
          this.$router.replace(this.localePath('/subscriptions'))

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true
        })
    },

    getItem(){
      this.$axios.$get('subscriptions/'+this.id+'/')
        .then(response => {
          this.form = response.data
          this.queryClients(response.data.client_name)
          this.queryProjects(response.data.project_name)
          this.employees_items = response.data.employees_list
          this.spaces_items = response.data.spaces_list

        })
        .catch((e)=>{
          this.$router.replace(this.localePath('/subscriptions/0'))
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
    },

    queryClients(v){
      this.loading = true
      this.$axios.$get('clients/?is_active=true&page_size=5&search='+v)
        .then(response => {
          this.loading = false

          this.clients_items = response.data.results

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true
          this.loading = false

        })
    },

  }
}
</script>

<style scoped>

</style>
