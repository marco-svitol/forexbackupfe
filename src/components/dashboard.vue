<template>
  <div class="hello">
    <p class="header">
      <a href='' v-on:click="logout()">
      logout {{userid}}
      </a>
    </p>
    
  
    <b-table 
      id="table-backuplog"
      striped 
      hover 
      bordered 
      small 
      head-variant='light'
      :items="items" 
      :fields="fields" 
    >
    <template v-slot:cell(n)="data">
      {{ data.index + 1 }}
    </template>
    
    <template v-slot:cell(ConsoleSynced)="data">
      <div :class="data.item.ConsoleSynced === 0 ? 'text-danger' : ''">
        {{ data.item.ConsoleSynced === 1?'Ok':'Not Ok'}}
      </div>
    </template>

    <template v-slot:cell(DateTime)="data">
      <div :class="data.item.alert === 1 ? 'text-danger' : ''">
      {{ data.item.DateTime }}
    </div>
    </template>

    <template v-slot:cell(LastHeartBeat)="data">
      <div :class="data.item.hbok === 1 ? 'text-success' : ''">
      {{data.item.LastHeartBeat}}
    </div>
    </template>

    <template v-slot:cell(runbackup)="data">
      <b-button size="sm" v-model="data.item.key" v-on:click="startbackup(data.item, 'runbkp')" class="mr-1" :variant="btnvariant(data.item)">
      {{ data.item.ack === 0?'in coda':'avvia' }}
      </b-button>
    </template>
     
    </b-table>
  </div>
</template>

<script>
import axios from '@/api'
export default {
  name: 'dashboard',
  computed: { userid: function() {
    if (localStorage.getItem('user')) {
       return JSON.parse(localStorage.getItem('user')).username
       }
    else 
      return '';
  }},
  //props: { userid : String},
  data() {
    return {
      sortBy: 'hostname',
      sortDesc: false,
      fields: [
        {key: 'n', label: 'n.'},
        {key: 'hostname', label: 'Nome computer', sortable: true},
        {key: 'MCFTVer', label: 'MCForexTalk ver.', sortable: true},
        {key: 'ConsoleSynced', label: 'ConsoleSynced', sortable: true},
        {key: 'DateTime', label: 'Ultimo backup', sortable: true},
        {key: 'LastHeartBeat', label: 'Ultimo heartbeat', sortable: true},
        {key: 'runbackup', label: 'Avvio backup'}
      ],
      items :null,
      polling: null} 
  },
  methods: {
    btnvariant(item){if (item.ack === 0) return 'secondary'; else return 'info'},
    logout: function(){
      localStorage.removeItem('user');
      axios.post('/logout',{},{
        withCredentials : true
      })
      this.$router.push({name : 'login'})
    },
    startbackup: function (item, action) {
      if (item.ack === 0) {
        if(confirm("Do you really want to delete?")){
          axios.post('/cancelAction',{
              computerId: item.computerid,
              action: action},
            {
              withCredentials: true
            }
          ).then((response)  =>  {
            response.data.startsWith("ok")?item.ack = 2:alert(response.data);
          }, (error)  =>  {
            alert(error)
          })
        }
        return;
      }
      axios.post('/requestAction',{
          computerId: item.computerid,
          action: action},
        {
          withCredentials: true
        }
        ).then((response)  =>  {
        response.data.startsWith("ok")?item.ack = 0:alert(response.data);
      }, (error)  =>  {
        alert(error)
      })
    },
    pollData () {
      this.polling = setInterval(() => {
        this.getData();
      }, 60000)
    },
    getData() {
      axios
          .get('/backuplog?action=runbkp', {
            withCredentials: true
          })
          .then(response => (this.items =  response.data))
    }
  },
  beforeDestroy () {
    clearInterval(this.polling)
  },
  created () {
    this.getData()
    this.pollData()
  },
	beforeCreate: function() {
		document.body.className = 'dashboard';
  }
}
</script>

<style>

#nav a {
   font-weight: normal;
   font-size: 15px;
}
.header {
  text-align: right;
}
.table > tbody > tr > td {
     vertical-align: middle;
}

</style>
