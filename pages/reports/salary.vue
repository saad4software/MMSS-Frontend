<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">
            {{$t('Salary_Calculator')}}
          </v-card-title>
          <v-form
            @submit.prevent="submitForm"
            ref="form"
          >


            <v-card-text>

              <v-autocomplete
                v-model="form.id"
                :loading="loading"
                :items="employees_items"
                :search-input.sync="search"
                :rules="[rules.required]"
                item-text="name"
                item-value="id"
                cache-items
                flat
                hide-no-data
                hide-details
                :label="$t('Employee')"
              ></v-autocomplete>

              <v-date-picker
                v-model="form.date"
                type="month"
                :locale="lang==='ar'?'ar-SY':'en'"
                class="mt-4"
              ></v-date-picker>

            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                type="submit"
              >
                {{$t('Calculate')}}
              </v-btn>

              <v-btn
                @click="$router.back()">
                {{$t('Cancel')}}
              </v-btn>
            </v-card-actions>

          </v-form>

        </v-card>

        <client-only>
          <div
            ref="html2Pdf"
            pdf-format="a4"
            pdf-orientation="portrait"
          >
            <section slot="pdf-content">
              <v-card class="mt-5" v-if="salary.name">
                <v-card-title>{{salary.name}} {{form.date}} Salary</v-card-title>
                <v-card-text>
                  {{$t('Base_Salary')}}: {{salary.salary}} <br/>

                  <div v-if="salary.rewards_sum>0">
                    {{$t('Rewards_Details')}}:
                    <v-simple-table>
                      <thead>
                      <tr>
                        <th>{{$t('Amount')}}</th>
                        <th>{{$t('Date')}}</th>
                        <th>{{$t('Notes')}}</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="item in salary.rewards">
                        <td>{{item.amount}}</td>
                        <td>{{item.date}}</td>
                        <td>{{item.notes}}</td>
                      </tr>

                      </tbody>
                    </v-simple-table>
                    {{$t('Rewards_sum')}}: {{salary.rewards_sum}} <br/>
                  </div>

                  <div v-if="salary.cutt_off_sum>0">
                    {{$t('Cutoffs_Details')}}:
                    <v-simple-table>
                      <thead>
                      <tr>
                        <th>{{$t('Amount')}}</th>
                        <th>{{$t('Date')}}</th>
                        <th>{{$t('Notes')}}</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="item in salary.cut_off">
                        <td>{{item.amount}}</td>
                        <td>{{item.date}}</td>
                        <td>{{item.notes}}</td>
                      </tr>

                      </tbody>
                    </v-simple-table>

                    {{$t('Cutoffs_sum')}}: {{ salary.cut_off_sum }} <br/>
                  </div>


                  <div v-if="salary.cutt_off_sum>0">
                    {{$t('Loans_Details')}}:
                    <v-simple-table>
                      <thead>
                      <tr>
                        <th>{{$t('Amount')}}</th>
                        <th>{{$t('Date')}}</th>
                        <th>{{$t('Notes')}}</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="item in salary.loans">
                        <td>{{item.amount}}</td>
                        <td>{{item.date}}</td>
                        <td>{{item.notes}}</td>
                      </tr>

                      </tbody>
                    </v-simple-table>

                    {{$t('Loans_sum')}}: {{ salary.loans_sum }} <br/>
                  </div>

                  <div v-if="salary.cutt_off_sum>0">
                    {{$t('Subs_Details')}}:
                    <v-simple-table>
                      <thead>
                      <tr>
                        <th>{{$t('Client')}}</th>
                        <th>{{$t('Project')}}</th>
                        <th>{{$t('Ratio')}}</th>
                        <th>{{$t('Amount')}}</th>
                        <th>{{$t('Thresh')}}</th>
                        <th>{{$t('Pay')}}</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="item in salary.subs">
                        <td>{{item.client__name}}</td>
                        <td>{{item.project__name}}</td>
                        <td>{{item.ratio}}</td>
                        <td>{{item.amount}}</td>
                        <td>{{item.thresh}}</td>
                        <td>{{item.pay}}</td>
                      </tr>

                      </tbody>
                    </v-simple-table>

                    {{$t('Subs_sum')}}: {{salary.subs_sum}} <br/>
                  </div>
                  <b>{{$t('total')}}:</b> {{salary.total}}
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="generateReport">{{$t('Print')}}</v-btn>
                    <v-btn color="primary" @click="addToTransactions">{{$t('Add_to_transactions')}}</v-btn>
                  </v-card-actions>
                </v-card-text>

              </v-card>
            </section>
          </div>
        </client-only>
        <v-btn color="primary" @click="generateReport">{{$t('Print')}}</v-btn>



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

import { mapMutations, mapGetters, mapState } from 'vuex'

export default {

  data() {
    return {

      snackText: '',
      snackShow: false,

      employees_items: [],
      loading: false,
      search: null,

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

      salary: {
        name: null,
        salary: null,
        rewards: null,
        cut_off: null,
        loans: null,
        subs: null,
        total: null,
        subscriptions: []
      },

      transactionsForm: {
        amount: null,
        type: 'O',
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        notes: null,
        isActive: true,
      }

    }
  },

  computed: {
    ...mapState('layout', {lang: state => state.lang}),

  },


  watch: {
    search (val) {
      val && val !== this.select && this.queryEmployees(val)
    },
  },


  methods: {
    submitForm(){
      if(this.$refs.form.validate()){
        // this.form.date += '-01'
        this.$axios.$get('/reports/salaries/?id='+this.form.id+'&date='+this.form.date+'-01')
          .then(response => {
            this.salary = response.data
            // console.log(response)

          })
          .catch((e)=>{
            this.snackText = e.response['data']['message']
            this.snackShow = true
          })
      } else
      {
        this.$toast.error(this.$t('msg_fill_fields'))
      }


      // if (this.$refs.form.validate()) {
      //   if (this.id <= 0) this.createItem()
      //   else this.editItem()
      // }

    },

    addToTransactions(){
      this.transactionsForm.amount = this.salary.total
      this.transactionsForm.notes = this.salary.name + " salary"
      this.$axios.$post('transactions/new/', this.transactionsForm)
        .then(response => {
          this.snackText = "Salary was added to transactions successfully"
          this.snackShow = true

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true


        })
    },



    createItem(){

      this.$axios.$post('reports/salary/', this.form)
        .then(response => {
          this.$router.replace('/reports/?id='+this.form.id+'&date='+this.form.date+'/')

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true


        })
    },

    editItem(){
      this.$axios.$put('motivations/'+this.form.id+'/', this.form)
        .then(response => {
          this.$router.replace('/motivations')

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true
        })
    },

    getItem(){
      this.$axios.$get('motivations/'+this.id+'/')
        .then(response => {
          this.form = response.data
          this.queryEmployees(response.data.name)
          delete this.form.name

        })
        .catch((e)=>{
          this.$router.replace('/motivations/0')
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

    generateReport () {
      this.$refs.html2Pdf.generatePdf()
    }

  }
}
</script>

<style scoped>

</style>
