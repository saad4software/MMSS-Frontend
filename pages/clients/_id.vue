<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">
            {{ $t(title) }}
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

              <v-text-field
                :label="$t('CEO')"
                v-model="form.ceo_name"
                clearable
              ></v-text-field>

              <v-text-field
                :label="$t('Phone')"
                v-model="form.phone"
                clearable
              ></v-text-field>

              <v-text-field
                :label="$t('Fax')"
                v-model="form.fax"
                clearable
              ></v-text-field>

              <v-text-field
                :label="$t('Mobile')"
                v-model="form.mobile"
                clearable
              ></v-text-field>

              <v-text-field
                :label="$t('Address')"
                v-model="form.address"
                clearable
              ></v-text-field>

              <v-text-field
                :label="$t('Field')"
                v-model="form.work_field"
                clearable
              ></v-text-field>

              <v-textarea
                :label="$t('Notes')"
                v-model="form.notes"
                clearable
              ></v-textarea>

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
                {{ $t(btn) }}
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



      title:'Add_Client',
      btn: 'Add',

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


      form: {
        id: '',
        name: '',
        ceo_name: '',
        phone: '',
        fax: '',
        mobile: '',
        address: '',
        work_field: '',
        notes: '',
        isActive: true,
      }
    }
  },

  mounted() {
    console.log(this.id)
    this.title = this.id <= 0 ? this.$t('Add_Client') : this.$t('Edit_Client')
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
      this.$axios.$post('clients/new/', this.form)
        .then(response => {
          this.$router.replace('/clients')

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true


        })
    },

    editItem(){
      this.$axios.$put('clients/'+this.form.id+'/', this.form)
        .then(response => {
          this.$router.replace(this.localePath('/clients'))

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true
        })
    },

    getItem(){
      this.$axios.$get('clients/'+this.id+'/')
        .then(response => {
          this.form = response.data

        })
        .catch((e)=>{
          this.$router.replace(this.localePath('/clients/0'))
        })

    }

  }
}
</script>

<style scoped>

</style>
