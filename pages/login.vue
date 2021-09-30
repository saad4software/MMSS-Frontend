<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline">
          {{$t('Login')}}
        </v-card-title>
        <v-form @submit.prevent="submitForm">
          <v-card-text>
            <v-text-field :label="$t('Name')" v-model="loginModel.username"></v-text-field>
            <v-text-field :label="$t('Password')" type="password" v-model="loginModel.password"></v-text-field>

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
</template>

<script>
export default {
  layout: 'empty',

  data() {
    return {
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
      this.$axios.$post('token/', this.loginModel)
        .then(response => {

          console.log(response.data.access)
          this.$axios.setToken(response.data.access,'Bearer')
          this.setRole(response)

          this.$router.back()

        })
        .catch((e)=>{
          console.log(e)
        })

    },

  }
}
</script>
