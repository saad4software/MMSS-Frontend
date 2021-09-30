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
              <v-text-field
                :label="$t('Name')"
                v-model="form.name"
                clearable
                hint="name should be unique"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-select
                :items="gender_items"
                item-text="name"
                item-value="value"
                label="Gender"
                v-model="form.gender"
              ></v-select>

              <v-menu
                ref="hiring_date"
                v-model="hiring_date_menu"
                :close-on-content-click="false"
                :return-value.sync="form.hiring_date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.hiring_date"
                    :label="$t('Hiring_Date')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.hiring_date"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="hiring_date_menu = false"
                  >
                    {{$t('Cancel')}}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.hiring_date.save(form.hiring_date)"
                  >
                    {{$t('OK')}}
                  </v-btn>
                </v-date-picker>
              </v-menu>

              <v-menu
                ref="leaving_date"
                v-model="leaving_date_menu"
                :close-on-content-click="false"
                :return-value.sync="form.leaving_date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.leaving_date"
                    :label="$t('Leaving_Date')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.leaving_date"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="leaving_date_menu = false"
                  >
                    {{$t('Cancel')}}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.leaving_date.save(form.leaving_date)"
                  >
                    {{$t('OK')}}
                  </v-btn>
                </v-date-picker>
              </v-menu>

              <v-text-field :label="$t('Phone')" clearable v-model="form.phone"></v-text-field>
              <v-text-field :label="$t('Address')" clearable v-model="form.address"></v-text-field>
              <v-text-field
                :label="$t('Salary')"
                clearable
                v-model="form.fixed_salary"
                :rules="[rules.required_number]"
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

      id: this.$route.params.id ,



      title:'',
      btn: '',

      hiring_date_menu: false,
      leaving_date_menu: false,

      snackText: '',
      snackShow: false,

      rules: {
        required: value => !!value || this.$t('Required'),
        required_number: value => /^\d+$/.test(value) || this.$t('Required_number'),
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      },


      gender_items: [
        {name: this.$t("Male"), value: "M"},
        {name: this.$t("Female"), value: "F"}
      ],
      form: {
        id: '',
        name: '',
        gender: 'M',
        hiring_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        leaving_date: null,
        phone: null,
        address: null,
        notes: null,
        fixed_salary: null,
        isActive: true,
      }
    }
  },

  mounted() {
    console.log(this.id)
    this.title = this.id <= 0 ? this.$t('Add_Employee') : this.$t('Edit_Employee')
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
      this.$axios.$post('employees/new/', this.form)
        .then(response => {
          this.$router.replace('/employees')

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true


        })
    },

    editItem(){
      this.$axios.$put('employees/'+this.form.id+'/', this.form)
        .then(response => {
          this.$router.replace(this.localePath('/employees'))

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true
        })
    },

    getItem(){
      this.$axios.$get('employees/'+this.id+'/')
        .then(response => {
          this.form = response.data

        })
        .catch((e)=>{
          this.$router.replace(this.localePath('/employees/0'))
        })

    }

  }
}
</script>

<style scoped>

</style>
