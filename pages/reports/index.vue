<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-container fluid>
        <v-row dense>
          <v-col
            lazy
            v-for="card in cards"
            :key="card.title"
            :cols="card.flex"
          >
            <v-card>
              <v-icon
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              >{{card.icon}}</v-icon>

              <v-card-title>{{card.title}}</v-card-title>
              <v-card-text>{{card.text}}</v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn icon  @click="$router.push(card.link)">
                  <v-icon>mdi-newspaper</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

    </v-col>
  </v-row>


</template>

<script>
export default {
  data: () => ({
    cards: [
    ],
  }),

  mounted() {
    this.cards = [
      { title: this.$t('Salary_Report'), text: this.$t("Salary_Report_des"), link: this.localePath("/reports/salary"), icon: 'mdi-cash-usd-outline', flex: 12 },
      { title: this.$t('Subscription_Report'), text: this.$t("Subscription_Report_des"), link: this.localePath("/reports/subscriptions"), icon: 'mdi-account-cash-outline', flex: 6 },
      { title: this.$t('Notifications'), text: this.$t("Notifications_des"), link: this.localePath("/reports/notifications"), icon: 'mdi-bell', flex: 6 },
      { title: this.$t('Projects_Report'), text: this.$t("Projects_Report_des"), link: this.localePath("/reports/projects"), icon: 'mdi-flag-variant-outline', flex: 6 },
      { title: this.$t('Employees_Report'), text: this.$t("Employees_Report_des"), link: this.localePath("/reports/employees"), icon: 'mdi-account-multiple', flex: 6 },
    ]
  },
}
</script>
