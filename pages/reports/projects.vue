<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">
            {{$t('Projects_Report')}}
          </v-card-title>
          <v-form
            @submit.prevent="submitForm"
            ref="form" >


            <v-card-text>
              <v-row class="ms-1 me-1 mt-1">
                <v-menu
                  ref="date_from"
                  v-model="date_from_menu"
                  :close-on-content-click="false"
                  :return-value.sync="form.from_data"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.from_data"
                      :label="$t('From')"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    :locale="lang==='ar'?'ar-SY':'en'"
                    v-model="form.from_data"
                    no-title
                    type="month"
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
                      @click="form.from_data = ''"
                    >
                      {{$t('Clear')}}
                    </v-btn>

                    <v-btn
                      text
                      color="primary"
                      @click="$refs.date_from.save(form.from_data)"
                    >
                      {{$t('OK')}}
                    </v-btn>
                  </v-date-picker>
                </v-menu>

                <v-menu
                  ref="date_to"
                  v-model="date_to_menu"
                  :close-on-content-click="false"
                  :return-value.sync="form.to_data"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.to_data"
                      :label="$t('To')"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.to_data"
                    :locale="lang==='ar'?'ar-SY':'en'"
                    no-title
                    type="month"
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
                      @click="form.to_data = ''"
                    >
                      {{$t('Clear')}}
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.date_to.save(form.to_data)"
                    >
                      {{$t('OK')}}
                    </v-btn>
                  </v-date-picker>
                </v-menu>

              </v-row>
              <v-autocomplete
                v-model="form.selected_project"
                :loading="loading"
                :items="project_items"
                :search-input.sync="search_projects"
                item-text="name"
                item-value="id"
                return-object
                cache-items
                flat
                hide-no-data
                :label="$t('Project')"
              ></v-autocomplete>


            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                type="submit">
                {{$t('Calculate')}}
              </v-btn>
            </v-card-actions>

          </v-form>

        </v-card>

        <v-card class="mt-5" v-if="subscriptions.length>0">
          <v-card-title>
            {{$t('Subscription_from')}} {{form.from_data}} {{$t('to')}} {{form.to_data}}
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <download-csv
              dark
              class="mb-2"
              :data   = "subscriptions"
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
                <th>{{$t('Amount')}}</th>
                <th>{{$t('Pay1_amount')}}</th>
                <th>{{$t('Pay1_date')}}</th>
                <th>{{$t('Pay2_amount')}}</th>
                <th>{{$t('Pay2_date')}}</th>
                <th>{{$t('Pay3_amount')}}</th>
                <th>{{$t('Pay3_date')}}</th>
                <th>{{$t('Payments_sum')}}</th>
                <th>{{$t('Left')}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in subscriptions">
                <td>{{item.client__name}}</td>
                <td>{{item.project__name}}</td>
                <td>{{item.amount}}</td>

                <td>{{item.pay1_amount}}</td>
                <td>{{item.pay1_date}}</td>

                <td>{{item.pay2_amount}}</td>
                <td>{{item.pay2_date}}</td>

                <td>{{item.pay3_amount}}</td>
                <td>{{item.pay3_date}}</td>

                <td>{{item.payments_sum}}</td>
                <td>{{item.amount - item.payments_sum}}</td>
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

      project_items: [],
      loading: false,
      search_projects: null,

      date_from_menu: false,
      date_to_menu: false,
      date_from: '',
      date_to: '',


      rules: {
        required: value => !!value || 'Required.',
        required_number: value => /^\d+$/.test(value) || 'Required number',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      },


      form: {
        selected_project: null,
        from_data: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 7),
        to_data: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 7),
      },
      subscriptions: [],

    }
  },

  computed: {
    ...mapState('layout', {lang: state => state.lang}),

  },


  watch: {
    search_projects (val) {
      val && val !== this.select && this.queryProjects(val)
    },

    // search (val) {
    //   val && val !== this.select && this.queryEmployees(val)
    // },
  },


  methods: {
    submitForm(){
      if(this.$refs.form.validate()){
        // this.form.date += '-01'
        this.$axios.$get('/reports/projects/?from='+this.form.from_data+'-01&to='+this.form.to_data+'-01'+'&id='+this.form.selected_project.id)
          .then(response => {
            this.subscriptions = response.data
            console.log(response)

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

    queryProjects(v){
      this.loading = true
      this.$axios.$get('projects/?is_active=true&page_size=5&search='+v)
        .then(response => {
          this.loading = false

          this.project_items = response.data.results

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
