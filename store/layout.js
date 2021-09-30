export const state = () => ({
  role: "G",
  lang: "ar"
})

export const mutations = {
  setRole(state, text ) {
    state.role = text
  },
  setLang(state, text ) {
    // this.$vuetify.rtl = text === "ar"
    // this.$i18n.setLocale(text)
    state.lang = text

  }
}

export const getters = {
  getDir: state => locale => {
    return state.lang === "ar"
  }

}
