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
                v-model="form.subscription"
                :loading="loading"
                :items="subscriptions_items"
                :search-input.sync="search_subscriptions"
                item-text="paper_id"
                item-value="id"
                cache-items
                flat
                hide-no-data
                :label="$t('Subscription')"
              ></v-autocomplete>

              <v-text-field
                :label="$t('Amount')"
                v-model="form.amount"
                clearable
                :rules="[rules.required_number]"
              ></v-text-field>

              <v-text-field
                :label="$t('Payment_ID')"
                v-model="form.paper_id"
                clearable
                :rules="[rules.required_number]"
              ></v-text-field>

              <v-menu
                ref="date_from"
                v-model="date_from_menu"
                :close-on-content-click="false"
                :return-value.sync="form.date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.date"
                    :label="$t('Date')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.date"
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
                    @click="form.date = ''"
                  >
                    {{$t('Clear')}}
                  </v-btn>

                  <v-btn
                    text
                    color="primary"
                    @click="$refs.date_from.save(form.date)"
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

      subscriptions_items:[],

      loading: false,
      search_subscriptions: null,


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
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        amount: null,
        paper_id: null,
        subscription: null,
        notes: null,
        isActive: true,
      }
    }
  },



  watch: {
    search_subscriptions (val) {
      val && val !== this.select && this.querySubscription(val)
    },

  },

  mounted() {
    console.log(this.id)
    this.title = this.id <= 0 ? this.$t('Add_Payment') : this.$t('Edit_Payment')
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

      this.$axios.$post('payments/new/', this.form)
        .then(response => {
          this.$router.replace(this.localePath('/payments'))

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true


        })
    },

    editItem(){
      this.$axios.$put('payments/'+this.form.id+'/', this.form)
        .then(response => {
          this.$router.replace(this.localePath('/payments'))

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true
        })
    },

    getItem(){
      this.$axios.$get('payments/'+this.id+'/')
        .then(response => {
          this.form = response.data
          this.querySubscription(response.data.subscription_id)


        })
        .catch((e)=>{
          this.$router.replace(this.localePath('/payments/0'))
        })

    },

    querySubscription(v){
      this.loading = true
      this.$axios.$get('subscriptions/?is_active=true&page_size=5&search='+v)
        .then(response => {
          this.loading = false

          this.subscriptions_items = response.data.results

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
