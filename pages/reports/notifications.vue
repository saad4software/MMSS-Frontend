<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">
            {{$t('Notifications_Center')}}
          </v-card-title>
          <v-form
            @submit.prevent="submitForm"
            ref="form"
          >


            <v-card-text>

              <v-autocomplete
                v-model="form.employees_list"
                :loading="loading"
                :items="employees_items"
                :search-input.sync="search_employees"
                item-text="name"
                item-value="id"
                return-object
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


              <v-date-picker
                v-model="form.date"
                :locale="lang==='ar'?'ar-SY':'en'"
                type="month"
                class="mt-4"
              ></v-date-picker>

            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                type="submit"
              >
                {{$t('Generate')}}
              </v-btn>
            </v-card-actions>

          </v-form>

        </v-card>

        <v-card class="mt-5" v-if="subscriptions.length>0">
          <v-card-title>{{$t('subs_expires')}} {{form.date}}
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <download-csv
              dark
              class="mb-2"
              :data="subscriptions"
            >
              <v-icon>mdi-microsoft-excel</v-icon>
            </download-csv>
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <thead>
              <tr>
                <th>{{$t('Client')}}</th>
                <th>{{$t('Project')}}</th>
                <th>{{$t('Left_amount')}}</th>
                <th>{{$t('Exp_Date')}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in subscriptions">
                <td><nuxt-link :to="'/clients?search='+item.client__name">{{item.client__name}}</nuxt-link></td>
                <td>{{item.project__name}}</td>
                <td>{{item.amount - item.payments_sum}}</td>
                <td>{{item.to_date}}</td>
              </tr>

              </tbody>
            </v-simple-table>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary">{{$t('Print')}}</v-btn>
            </v-card-actions>
          </v-card-text>

        </v-card>

        <v-card class="mt-5" v-if="payments.length>0">
          <v-card-title>{{$t('due_payments')}} {{form.date}}
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <download-csv
              dark
              class="mb-2"
              :data="payments"
            >
              <v-icon>mdi-microsoft-excel</v-icon>
            </download-csv>
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <thead>
              <tr>
                <th>{{$t('Client')}}</th>
                <th>{{$t('Project')}}</th>
                <th>{{$t('Date')}}</th>
                <th>{{$t('Paper_ID')}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in payments">
                <td><nuxt-link :to="'/clients?search='+item.subscription__client__name">{{item.subscription__client__name}}</nuxt-link></td>
                <td>{{item.subscription__project__name}}</td>
                <td>{{item.date}}</td>
                <td>{{item.paper_id}}</td>
              </tr>

              </tbody>
            </v-simple-table>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary">{{$t('Print')}}</v-btn>
              <v-btn
                @click="$router.back()">
                {{$t('Cancel')}}
              </v-btn>

            </v-card-actions>
          </v-card-text>

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
import {mapState} from "vuex";

export default {

  data() {
    return {


      snackText: '',
      snackShow: false,

      loading: false,

      employees_items: [],
      search_employees: null,

      projects_items:[],
      search_projects: null,

      clients_items:[],
      search_clients: null,


      rules: {
        required: value => !!value || 'Required.',
        required_number: value => /^\d+$/.test(value) || 'Required number',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      },


      form: {
        id: null,
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 7),
      },
      subscriptions:[],
      payments:[],
    }
  },

  computed: {
    ...mapState('layout', {lang: state => state.lang}),

  },


  watch: {
    search_employees (val) {
      val && val !== this.select && this.queryEmployees(val)
    },
    search_projects (val) {
      val && val !== this.select && this.queryProjects(val)
    },
    search_clients (val) {
      val && val !== this.select && this.queryClients(val)
    },
  },

  mounted() {
    this.submitForm()
  },


  methods: {
    submitForm(){
      if(this.$refs.form.validate()){

        this.$axios.$get('/reports/notifications/?date='+this.form.date+'-01'+'&project_id=&employee_id=&client_id=1')
          .then(response => {
            this.subscriptions = response.data.subscriptions
            this.payments = response.data.payments
            if(response.data.count === 0)
            {
              this.snackText = "No notifications to show"
              this.snackShow = true
            }

          })
          .catch((e)=>{
            this.snackText = e.response['data']['message']
            this.snackShow = true
          })
      }


      // if (this.$refs.form.validate()) {
      //   if (this.id <= 0) this.createItem()
      //   else this.editItem()
      // }

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
