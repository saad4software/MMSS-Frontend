<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      :right="lang==='ar'"
      fixed
      app
    >

      <v-list>
        <v-list-item @click.stop="miniVariant = !miniVariant">
          <v-list-item-action>
            <v-icon>
              mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>{{$t('MMSS')}}</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="localePath(item.to)"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="$t(item.title)"  />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title v-text="$t(title)" />
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            :to="localePath('/login')"
          >
            <v-icon>mdi-logout</v-icon>
          </v-btn>

        </template>
        <span>{{$t('Logout')}}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"

            @click="$router.push(localePath('/reports/notifications'))"
          >
            <v-badgeO
              color="deep-purple accent-4"
              :value="count"
              :content="count"
              left
            >
              <v-icon>mdi-bell</v-icon>
            </v-badgeO>
          </v-btn>

        </template>
        <span>{{$t('Notifications')}}</span>
      </v-tooltip>



      <v-menu
        open-on-hover
        top
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            icon>
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="switchLanguage('en')">
            <v-list-item-action>
              <v-icon>mdi-translate</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title
              >{{$t('English')}}</v-list-item-title>
            </v-list-item-content>

          </v-list-item>

          <v-list-item @click="switchLanguage('ar')">
            <v-list-item-action>
              <v-icon>mdi-translate</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{$t('Arabic')}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-menu>


    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span><a href="http://irsc.site"> &copy; {{ new Date().getFullYear() }} IRSC</a></span>
      <v-spacer/>
      <v-switch
        v-model="$vuetify.theme.dark"
        inset
        label="Theme"
      ></v-switch>

    </v-footer>
  </v-app>
</template>

<script>

import { mapMutations, mapGetters, mapState } from 'vuex'

export default {
  head () {
    return this.$nuxtI18nHead()
  },

  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      count: '',
      admin_items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/home'
        },
        {
          icon: 'mdi-account-box-multiple',
          title: 'Users',
          to: '/users'
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Employees',
          to: '/employees'
        },
        {
          icon: 'mdi-cash-usd-outline',
          title: 'Payments',
          to: '/payments'
        },
        {
          icon: 'mdi-account-convert-outline',
          title: 'Clients',
          to: '/clients'
        },
        {
          icon: 'mdi-cash-check',
          title: 'Motivations',
          to: '/motivations'
        },
        {
          icon: 'mdi-flag-variant-outline',
          title: 'Projects',
          to: '/projects'
        },
        {
          icon: 'mdi-sack-percent',
          title: 'Ratios',
          to: '/ratios'
        },
        {
          icon: 'mdi-format-align-top',
          title: 'Spaces',
          to: '/spaces'
        },
        {
          icon: 'mdi-finance',
          title: 'Subscriptions',
          to: '/subscriptions'
        },
        {
          icon: 'mdi-refresh',
          title: 'Transactions',
          to: '/transactions'
        },
        {
          icon: 'mdi-newspaper-variant-multiple',
          title: 'Reports',
          to: '/reports'
        },
      ],
      counter_items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/home'
        },
        {
          icon: 'mdi-cash-usd-outline',
          title: 'Payments',
          to: '/payments'
        },
        {
          icon: 'mdi-account-convert-outline',
          title: 'Clients',
          to: '/clients'
        },
        {
          icon: 'mdi-finance',
          title: 'Subscriptions',
          to: '/subscriptions'
        },
        {
          icon: 'mdi-refresh',
          title: 'Transactions',
          to: '/transactions'
        },
        {
          icon: 'mdi-newspaper-variant-multiple',
          title: 'Reports',
          to: '/reports'
        },
      ],
      guest_items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/home'
        },
        {
          icon: 'mdi-newspaper-variant-multiple',
          title: 'Reports',
          to: '/reports'
        },
      ],
      items: this.guest_items,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'MMSS'
    }
  },

  computed: {
    ...mapState('layout', {lang: state => state.lang}),
    ...mapState('layout', {role: state => state.role}),

  },

  watch : {
    lang (val){
      this.data()
    },

    drawer (val) {

      console.log(this.role)
      if(this.role==='A')
        this.items = this.admin_items
      else if(this.role === 'C')
        this.items = this.counter_items
      else if(this.role === 'G')
        this.items = this.guest_items
      else
        this.$router.push('/')
    },


  },

  mounted() {
    this.getData()
  },
  methods: {


    switchLanguage(lang){

      this.$vuetify.rtl = lang === 'ar'
      this.$store.commit('layout/setLang', lang)
      this.$i18n.setLocaleCookie(lang)
      this.$router.replace(this.switchLocalePath(lang));

    },

    setRole (e) {
      this.$store.commit('layout/setRole', e.data.role)
    },

    getData(){
      let date= (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)

      this.$axios.$get('/reports/notifications/?date='+date)
          .then(response => {
            if (response.data.count > 0) {
              this.count = response.data.count
            }

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

    },

  }
}
</script>
