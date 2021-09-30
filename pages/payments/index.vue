<template>
  <div>


    <v-col>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        single-line
        hide-details

        :label="$t('Search')"
      />

      <v-row class="ms-1 me-1 mt-1">
        <v-menu
          ref="date_from"
          v-model="date_from_menu"
          :close-on-content-click="false"
          :return-value.sync="date_from"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date_from"
              :label="$t('From')"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date_from"
            no-title
            scrollable
          >
            <v-btn
              text
              color="primary"
              @click="date_from_menu = false"
            >
              {{$t('Cancel')}}
            </v-btn>

            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="date_from = ''"
            >
              {{$t('Clear')}}
            </v-btn>

            <v-btn
              text
              color="primary"
              @click="$refs.date_from.save(date_from)"
            >
              {{$t('OK')}}
            </v-btn>
          </v-date-picker>
        </v-menu>

        <v-menu
          ref="date_to"
          v-model="date_to_menu"
          :close-on-content-click="false"
          :return-value.sync="date_to"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date_to"
              :label="$t('To')"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date_to"
            no-title
            scrollable
          >
            <v-btn
              text
              color="primary"
              @click="date_to_menu = false"
            >
              {{$t('Cancel')}}
            </v-btn>
            <v-spacer></v-spacer>

            <v-btn
              text
              color="primary"
              @click="date_to = ''"
            >
              {{$t('Clear')}}
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.date_to.save(date_to)"
            >
              {{$t('OK')}}
            </v-btn>
          </v-date-picker>
        </v-menu>

      </v-row>


    </v-col>
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
          <v-toolbar-title>{{$t('Payments')}}</v-toolbar-title>
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
                @click="$router.push(localePath('/payments/0'))"
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
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
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

      <template v-slot:item.actions="{ item }">
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

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          {{$t('Notes')}}:<br/> {{ item.notes }}
        </td>

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
          {{$t('Close')}}
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
        { text: this.$t('From'), value: 'client_name'},
        { text: this.$t('Sub_ID'), value: 'subscription_id'},
        { text: this.$t('Amount'), value: 'amount'},
        { text: this.$t('Payment_ID'), value: 'paper_id'},
        { text: this.$t('Date'), value: 'date'},
        { text: this.$t('Actions'), value: 'actions', sortable: false },

      ],
      items: [],
      totalItems: 0,
      search: '',
      options: {},
      sub_id: this.$route.query.sub_id,


      snackText: '',
      snackShow: false,

      dialogDelete: false,
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},

      date_from: '',
      date_to: '',

      date_from_menu: false,
      date_to_menu: false,

    }
  },

  watch: {
    search (val) {
      this.getData()
    },
    date_from (val) {
      this.getData()
    },

    date_to (val) {
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

      if(this.sub_id === undefined) this.sub_id = ''
      this.$axios.$get('payments/?'+
        'min_date='+ this.date_from +
        '&max_date='+ this.date_to +
        '&page_size='+itemsPerPage +
        '&sub_id='+this.sub_id +
        '&page='+page+
        '&search=' + this.search)
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
      this.$router.push(this.localePath('/payments/' + this.editedItem.id))
    },

    deleteItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.$axios.$delete('payments/'+this.editedItem.id)
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
