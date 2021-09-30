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
                v-model="form.username"
                clearable
                hint="name should be unique"
                :rules="[rules.required]"
                required
              ></v-text-field>

              <v-text-field
                :label="$t('Password')"
                v-model="form.password1"
                type="password"
                clearable
                :rules="[rules.required]"
                required
              ></v-text-field>

              <v-text-field
                :label="$t('Confirm_password')"
                v-model="form.password2"
                type="password"
                clearable
                :rules="[rules.required]"
                required
              ></v-text-field>

              <v-select
                :items="type_items"
                item-text="name"
                item-value="value"
                :label="$t('Role')"
                v-model="form.role"
              ></v-select>


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

      type_items: [
        {name: "Admin", value: "A"},
        {name: "Counter", value: "C"},
        {name: "Guest", value: "G"},
      ],


      form: {
        id: '',
        username: '',
        password1: '',
        password2: '',
        role: '',
        isActive: true,
      }
    }
  },

  mounted() {
    console.log(this.id)
    this.title = this.id <= 0 ? this.$t('Add_User') : this.$t('Edit_User')
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
      this.$axios.$post('users/new/', this.form)
        .then(response => {
          this.$router.replace(this.localePath('/users'))

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true


        })
    },

    editItem(){
      this.$axios.$put('users/'+this.form.id+'/', this.form)
        .then(response => {
          this.$router.replace(this.localePath('/users'))

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true
        })
    },

    getItem(){
      this.$axios.$get('users/'+this.id+'/')
        .then(response => {
          this.form = response.data

        })
        .catch((e)=>{
          this.$router.replace(this.localePath('/users/0'))
        })

    }

  }
}
</script>

<style scoped>

</style>
