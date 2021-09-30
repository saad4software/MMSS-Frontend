<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">
            {{$t('Login')}}
          </v-card-title>
          <v-form @submit.prevent="submitForm" ref="form">
            <v-card-text>
              <v-text-field
                :label="$t('Name')"
                v-model="loginModel.username"
                :rules="[rules.required]"
              ></v-text-field>
              <v-text-field
                :label="$t('Password')"
                type="password"
                :rules="[rules.required]"
                v-model="loginModel.password"
              ></v-text-field>

            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                type="submit"
              >
                {{$t('Login')}}
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
  layout: 'empty',
  data() {
    return {
      rules: {
        required: value => !!value || this.$t('Required'),
        required_number: value => /^\d+$/.test(value) || this.$t('Required_number'),
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      },

      snackText: '',
      snackShow: false,

      loginModel: {
        username: '',
        password: '',
      }
    }
  },

  mounted() {


  },

  created(){

  },

  methods: {

    setRole (e) {
      this.$store.commit('layout/setRole', e.data.role)
    },


    submitForm(){

      if(this.$refs.form.validate())
      {
        this.$axios.$post('token/', this.loginModel)
          .then(response => {

            console.log(response.data)
            this.$axios.setToken(response.data.access,'Bearer')
            this.setRole(response)
            this.$router.push('/home')

          })
          .catch((e)=>{
            this.snackText = e.response['data']['message']
            this.snackShow = true
          })
      }

    },



  }
}
</script>
