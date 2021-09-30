<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">

        <v-card>
          <v-card-title class="headline">
            {{$t('Client_Details')}}
          </v-card-title>
          <v-form
            @submit.prevent="submitClientForm"
            ref="clientForm"
          >
            <v-card-text>

              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :label="$t('Name')"
                    v-model="clientForm.name"
                    v-bind="attrs"
                    v-on="on"
                    clearable
                    hint="name should be unique"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in clients_items"
                    :key="index"
                    @click="clientForm = item"
                  >
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :label="$t('CEO')"
                    v-model="clientForm.ceo_name"
                    v-bind="attrs"
                    v-on="on"
                    clearable
                    required
                  ></v-text-field>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in clients_items"
                    :key="index"
                    @click="clientForm = item"
                  >
                    <v-list-item-title>{{ item.ceo_name }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :label="$t('Phone')"
                    v-model="clientForm.phone"
                    v-bind="attrs"
                    v-on="on"
                    clearable
                    required
                  ></v-text-field>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in clients_items"
                    :key="index"
                    @click="clientForm = item"
                  >
                    <v-list-item-title>{{ item.phone }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :label="$t('Mobile')"
                    v-model="clientForm.mobile"
                    v-bind="attrs"
                    v-on="on"
                    clearable
                  ></v-text-field>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in clients_items"
                    :key="index"
                    @click="clientForm = item"
                  >
                    <v-list-item-title>{{ item.mobile }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :label="$t('Fax')"
                    v-model="clientForm.fax"
                    v-bind="attrs"
                    v-on="on"
                    clearable
                  ></v-text-field>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in clients_items"
                    :key="index"
                    @click="clientForm = item"
                  >
                    <v-list-item-title>{{ item.fax }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-text-field
                :label="$t('Address')"
                v-model="clientForm.address"
                clearable
              ></v-text-field>

              <v-text-field
                :label="$t('Field')"
                v-model="clientForm.work_field"
                clearable
              ></v-text-field>

              <v-textarea
                :label="$t('Notes')"
                v-model="clientForm.notes"
                clearable
              ></v-textarea>

            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                @click="clearClientForm"
              >
                {{$t('clear')}}
              </v-btn>

              <v-btn
                color="primary"
                type="submit"
              >
                {{ btnClient }}
              </v-btn>

            </v-card-actions>

          </v-form>

        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">
            {{$t('Subscription_Details')}}
          </v-card-title>
          <v-form
            @submit.prevent="submitSubForm"
            ref="form"
          >


            <v-card-text>

              <v-autocomplete
                v-model="subscriptionForm.employees"
                :loading="loading"
                :items="employees_items"
                :search-input.sync="search_employees"
                item-text="name"
                item-value="id"
                cache-items
                multiple
                chips
                flat
                hide-no-data
                :label="$t('Employees')"
              ></v-autocomplete>

              <v-autocomplete
                v-model="subscriptionForm.spaces"
                :loading="loading"
                :items="spaces_items"
                :search-input.sync="search_spaces"
                item-text="name"
                item-value="id"
                cache-items
                multiple
                chips
                flat
                hide-no-data
                :label="$t('Spaces')"
              ></v-autocomplete>

              <v-autocomplete
                v-model="subscriptionForm.project"
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



              <v-text-field
                :label="$t('Amount')"
                v-model="subscriptionForm.amount"
                clearable
                :rules="[rules.required_number]"
              ></v-text-field>

              <v-text-field
                :label="$t('Paper_ID')"
                v-model="subscriptionForm.paper_id"
                clearable
                :rules="[rules.required_number]"
              ></v-text-field>

              <v-menu
                ref="date_from"
                v-model="date_from_menu"
                :close-on-content-click="false"
                :return-value.sync="subscriptionForm.from_date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="subscriptionForm.from_date"
                    :label="$t('From')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="subscriptionForm.from_date"
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
                    @click="subscriptionForm.from_date = ''"
                  >
                    {{$t('Clear')}}
                  </v-btn>

                  <v-btn
                    text
                    color="primary"
                    @click="$refs.date_from.save(subscriptionForm.from_date)"
                  >
                    {{$t('OK')}}
                  </v-btn>
                </v-date-picker>
              </v-menu>

              <v-menu
                ref="date_to"
                v-model="date_to_menu"
                :close-on-content-click="false"
                :return-value.sync="subscriptionForm.to_date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="subscriptionForm.to_date"
                    :label="$t('To')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="subscriptionForm.to_date"
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
                    @click="subscriptionForm.to_date = ''"
                  >
                    {{$t('Clear')}}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.date_to.save(subscriptionForm.to_date)"
                  >
                    {{$t('OK')}}
                  </v-btn>
                </v-date-picker>
              </v-menu>


              <v-textarea :label="$t('Notes')" clearable v-model="subscriptionForm.notes"></v-textarea>


            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                type="submit"
              >
                {{ btnSub }}
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
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </div>
</template>
<script>
export default {

  data() {
    return {


      title:'Home',
      btnSub: this.$t('Add'),
      btnClient: this.$t('Add'),

      snackText: '',
      snackShow: false,



      employees_items: [],
      projects_items:[],
      clients_items:[],
      spaces_items:[],

      loading: false,
      search_employees: null,
      search_projects: null,
      search_spaces: null,

      client_name: null,
      client_ceo: null,
      client_phone: null,
      client_mobile: null,
      client_fax: null,


      date_from_menu: false,
      date_to_menu: false,


      rules: {
        required: value => !!value || 'Required.',
        required_number: value => /^\d+$/.test(value) || 'Required number',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      },


      clientForm: {
        id: null,
        name: null,
        ceo_name: null,
        phone: null,
        fax: null,
        mobile: null,
        address: null,
        work_field: null,
        notes: null,
        isActive: true,
      },

      subscriptionForm: {
        id: null,
        from_date: null,
        to_date: null,
        amount: null,
        paper_id: null,
        project: null,
        client: null,
        notes: null,
        employees: [],
        spaces: [],
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


    'clientForm.name' (val) {
      val && val !== this.select && this.queryClients(val)
    },
    'clientForm.ceo_name' (val) {
      val && val !== this.select && this.queryClients(val)
    },
    'clientForm.phone' (val) {
      val && val !== this.select && this.queryClients(val)
    },
    'clientForm.mobile' (val) {
      val && val !== this.select && this.queryClients(val)
    },
    'clientForm.fax' (val) {
      val && val !== this.select && this.queryClients(val)
    },
    'clientForm.id' (val) {
      this.btnClient = val===null  ? this.$t("Add") : this.$t("edit")
    }



  },


  mounted() {

  },

  methods: {
    submitClientForm(){
      if (this.$refs.clientForm.validate()) {
        if (this.clientForm.id === null) this.createClientItem()
        else this.editClientItem()
      }

    },

    clearClientForm(){
      this.clientForm.id = null
      this.$refs.clientForm.reset()
    },

    createClientItem(){
      this.$axios.$post('clients/new/', this.clientForm)
        .then(response => {
          this.clientForm = response.data

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true


        })
    },

    editClientItem(){
      this.$axios.$put('clients/'+this.clientForm.id+'/', this.clientForm)
        .then(response => {
          this.clientForm = response.data

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true
        })
    },

    getClientItem(){
      this.$axios.$get('clients/'+this.id+'/')
        .then(response => {
          this.form = response.data

        })
        .catch((e)=>{
          this.$router.replace('/clients/0')
        })

    },

    submitSubForm(){
      if (this.$refs.form.validate()) {
        this.createSubItem()
      }

    },
    createSubItem(){
      if (this.clientForm.id === null) {
        this.snackText = "Please select or create a client"
        this.snackShow = true
        return
      }

      this.subscriptionForm.client = this.clientForm.id
      this.$axios.$post('subscriptions/new/', this.subscriptionForm)
        .then(response => {
          this.$refs.form.reset()
          this.$refs.clientForm.reset()
          this.clientForm.id = null
          this.snackText = "Subscription was added successfully"
          this.snackShow = true

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true

        })
    },

    editSubItem(){
      this.$axios.$put('subscriptions/'+this.form.id+'/', this.subscriptionForm)
        .then(response => {
          this.$router.replace('/subscriptions')

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true
        })
    },

    getSubItem(){
      this.$axios.$get('subscriptions/'+this.id+'/')
        .then(response => {
          this.form = response.data
          this.queryClients(response.data.client_name)
          this.queryProjects(response.data.project_name)
          this.employees_items = response.data.employees
          this.spaces_items = response.data.spaces

        })
        .catch((e)=>{
          this.$router.replace('/subscriptions/0')
        })

    },

    queryEmployees(v){
      this.loading = true
      this.$axios.$get('employees/?page_size=5&search='+v)
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
      this.$axios.$get('projects/?page_size=5&search='+v)
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
      this.$axios.$get('spaces/?page_size=5&search='+v)
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
      this.$axios.$get('clients/?page_size=5&search='+v)
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
