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
                :search-input.sync="search"
                item-text="name"
                item-value="id"
                cache-items
                flat
                hide-no-data
                hide-details
                :label="$t('Employee')"
              ></v-autocomplete>


              <v-text-field
                :label="$t('Amount')"
                v-model="form.amount"
                type="number"
                clearable
                hint="can be negative for loans"
                required
              ></v-text-field>

              <v-select
                :items="type_items"
                item-text="name"
                item-value="value"
                :label="$t('Type')"
                v-model="form.type"
              ></v-select>

              <v-menu
                ref="date"
                v-model="date_menu"
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
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="date_menu = false"
                  >
                    {{$t('Cancel')}}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.date.save(form.date)"
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
      loading: false,
      search: null,

      type_items: [
        {name: this.$t("Reward"), value: "R"},
        {name: this.$t("Cutoff"), value: "C"},
        {name: this.$t("Loan"), value: "L"},
      ],


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
        amount: null,
        type: 'R',
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        notes: null,
        employee: null,
        isActive: true,
      }
    }
  },



  watch: {
      search (val) {
        val && val !== this.select && this.queryEmployees(val)
      },
    },

  mounted() {
    console.log(this.id)
    this.title = this.id <= 0 ? this.$t('Add_Motivation') : this.$t('Edit_Motivation')
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

      this.$axios.$post('motivations/new/', this.form)
        .then(response => {
          this.$router.replace(this.localePath('/motivations'))

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true


        })
    },

    editItem(){
      this.$axios.$put('motivations/'+this.form.id+'/', this.form)
        .then(response => {
          this.$router.replace(this.localePath('/motivations'))

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
          this.$router.replace(this.localePath('/motivations/0'))
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
    }

  }
}
</script>

<style scoped>

</style>
