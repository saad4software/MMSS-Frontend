<template>
  <div>


    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      single-line
      hide-details
      :label="$t('Search')"
    />
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="name"
      show-expand
      :options.sync="options"
      :server-items-length="totalItems"
      class="elevation-1 mt-5"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>{{$t('Employees')}}</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <download-csv
            dark
            class="mb-2"
            :data   = "items"
          >
            <v-icon>mdi-microsoft-excel</v-icon>
          </download-csv>

          <v-spacer></v-spacer>
          <v-dialog
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                @click="$router.push(localePath('/employees/0'))"
              >
                {{$t('New_Item')}}
              </v-btn>
            </template>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">{{$t('msg_delete')}}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">{{$t('Cancel')}}</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">{{$t('OK')}}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.isActive="{ item }">
        <v-simple-checkbox
          v-model="item.isActive"
          disabled
        ></v-simple-checkbox>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          {{$t('hiring_date')}}: {{ item.hiring_date }} <br/>
          {{$t('leaving_date')}}: {{ item.leaving_date }} <br/>
          {{$t('Notes')}}:<br/> {{ item.notes }}
        </td>

      </template>

      <template v-slot:item.actions="{ item }">

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              class="mr-2"
              icon
              v-bind="attrs"
              v-on="on"
              :to="localePath('/motivations/?emp_id='+item.id)"
            >
              <v-icon>mdi-cash-check</v-icon>
            </v-btn>

          </template>
          <span>{{$t('Motivations')}}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              small
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="editItem(item)"
            >
              <v-icon>mdi-pencil</v-icon>

            </v-btn>

          </template>
          <span>{{$t('Edit')}}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              small
              v-bind="attrs"
              v-on="on"
              @click="deleteItem(item)"
            >
              <v-icon>mdi-delete</v-icon>

            </v-btn>

          </template>
          <span>{{$t('Delete')}}</span>
        </v-tooltip>

      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="initialize"
        >
         {{$t('Reset')}}
        </v-btn>
      </template>
    </v-data-table>

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
  name: "index",
  data(){
    return {
      headers: [
        { text: this.$t('isActive'), value: 'isActive'},
        { text: this.$t('Name'), value: 'name'},
        { text: this.$t('Phone'), value: 'phone'},
        { text: this.$t('Address'), value: 'address'},
        { text: this.$t('Salary'), value: 'fixed_salary'},
        { text: this.$t('Actions'), value: 'actions', sortable: false },
      ],
      items: [],
      totalItems: 0,
      search: '',
      options: {},
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      snackText: 'hello world',
      snackShow: false,

      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        gender: 'M',
        hiring_date: '',
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    }
  },

  watch: {
    search (val) {
      this.getData()
    },
    options: {
      handler () {
        this.getData()
      },
      deep: true,
    },

  },

  mounted() {
    this.getData()

  },

  created(){

  },

  methods: {


    getData() {

      const { sortBy, sortDesc, page, itemsPerPage } = this.options

      this.$axios.$get('employees/?page_size='+itemsPerPage +'&page='+page+'&search=' + this.search)
        .then(response => {
          this.totalItems = response.data.count
          this.items = response.data.results

        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true
        })


    },

    initialize(){
      this.search = ''
      this.getData()
    },

    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.$router.push(this.localePath('/employees/' + this.editedItem.id))
    },

    deleteItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.$axios.$delete('employees/'+this.editedItem.id)
        .then(response => {
          this.snackText = "item deleted successfully"
          this.snackShow = true
          this.initialize()
        })
        .catch((e)=>{
          this.snackText = e.response['data']['message']
          this.snackShow = true
        })

      this.closeDelete()
    },


    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },


  }
}
</script>


<style scoped>

</style>
