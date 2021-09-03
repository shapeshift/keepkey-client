<template>
  <q-card class="text-center q-pl-lg q-pr-lg" style="min-width:450px;">
    <small>Setup Pioneer Server</small>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
    >
      <q-card-section>
        <div v-if="!pioneerLive">
          <div>selected: {{serverSelected.name}}</div>
          <div>live: {{selectedLive}}</div>
          <div>ping: {{selectedPing}}</div>
          <br/>

          <div v-if="featureSelfHost">
            <q-input
              filled
              v-model="spec"
              label="Pioneer URL"
              hint=""
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
          </div>
          <div v-if="!featureSelfHost">
<!--        spec: {{spec}} -->

            <q-btn-dropdown
              split
              color="green"
              rounded
              :label=name
              @click="onServerClick(name)"
            >
              <q-list>
                <div v-for="(server, index) in availableServers" :key="index" class="q-mb-sm">
                  <q-item clickable v-close-popup @click="onServerClick(server.name)">
                    <q-item-section>
                      <div class="row no-wrap q-pa-md">
                        <div class="column">
                          <div class="small q-mb-md">live:{{server.live}}</div>
                          <div class="small q-mb-md">ping:{{server.ping}}</div>
                          <div class="small q-mb-md">spec:{{server.spec}}</div>
                          <div class="small q-mb-md">wss:{{server.wss}}</div>
                        </div>

                        <q-separator vertical inset class="q-mx-lg"></q-separator>

                        <div class="column items-center">
                          <q-avatar size="72px">
                            <img width=42 height=42 :src=server.icon>
                          </q-avatar>

                          <div class="text-subtitle1 q-mt-md q-mb-xs">{{server.name}}</div>

                          <q-btn
                            color="primary"
                            label="view docs"
                            push
                            size="sm"
                            v-close-popup
                            @click="openDocs(server.name)"
                          ></q-btn>
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </div>
              </q-list>
            </q-btn-dropdown>

          </div>
          <div v-if="!isTesting">
            Please Select Server....
          </div>
          <div v-if="isTesting">
            <small>Attempting to connect...</small>
            <q-spinner
              color="primary"
              size="5rem"
              v-if="true"
              key="spinner"
            />
          </div>
        </div>
      </q-card-section>
    </q-form>
  </q-card>
</template>
<script>
  /*

      Username Dialog

      Verify connected to pioneer:

      Offer changing of url if not live

   */
  import {ipcRenderer} from "electron";

  let featureSelfHost = process.env['SELF_HOST_FEATURE']
  const Identicon = require('identicon.js')

  //TODO offer pre-generated name
  // import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

  //default servers
  //TODO download live servers from network
  let defaultServers = [
    {
      name:"pioneers.dev",
      live:'unknown',
      ping:'unknown',
      docs:"https://pioneers.dev/docs",
      spec:"https://pioneers.dev/spec/swagger.json",
      wss:"wss://pioneers.dev",
      icon:"data:image/png;base64,"+new Identicon('https://pioneers.dev/spec/swagger.json', 420).toString()
    },
    {
      name:"localhost",
      docs:"http://127.0.0.1:9001/docs",
      live:'unknown',
      ping:'unknown',
      spec:"http://127.0.0.1:9001/spec/swagger.json",
      wss:"ws://127.0.0.1:9001",
      icon:"data:image/png;base64,"+new Identicon('http://127.0.0.1:9001/spec/swagger.json', 420).toString()
    },
    //soon (tm)
    // {
    //   spec:"https://beta.pioneers.dev/spec/swagger.json",
    //   wss:"wss://beta.pioneers.dev"
    // },
  ]

  import {mapGetters, mapMutations} from 'vuex'
  export default {
    data () {
      return {
        featureSelfHost,
        selectedLive:'',
        selectedPing:'',
        availableServers:defaultServers,
        serverSelected:defaultServers[0],
        isTesting:false,
        isAccepted:false,
        error:false,
        pioneerLive:false,
        usersOnline:[],
        usersOnlineCount:0,
        name:defaultServers[0].name,
        password:""
      }
    },
    computed: {
      ...mapGetters(['getspec','getPioneerStatus','getUsersOnline']),
    },
    async mounted() {
      try{
        this.onTest()
        ipcRenderer.on('latencyReport', (event, data) => {
          console.log('latencyReport event! ')
          console.log('data: ', data)
          console.log('data: ', data.server.name)
          console.log('data: ', data.result.totalTimeSeconds)
          //filter and update
          this.availableServers.find(server => server.name == data.server.name).ping = data.result.totalTimeSeconds
          this.availableServers.find(server => server.name == data.server.name).live = "online"

          if(data.server.name === this.serverSelected.name){
            this.selectedLive = "online"
            this.selectedPing = data.result.totalTimeSeconds
          }

          //this.pioneerLive = true
          this.isTesting = false
        })


        ipcRenderer.on('pushPioneerStatus', (event, data) => {
          console.log('pushPioneerStatus event! ',data)

          if(this.isAccepted && data.online){
            console.log("Continue")
          }

        })

      }catch(e){
        console.error(e)
      }
    },
    watch: {
      "$store.state.usersOnline": {
        handler: function() {
          const usersOnline = this.$store.getters['getUsersOnline'];
          console.log("usersOnline: ",usersOnline)
          this.usersOnline = usersOnline
          this.usersOnlineCount = usersOnline.length
        },
        immediate: true
      },
      "$store.state.spec": {
        handler: function() {
          // const spec = this.$store.getters['getspec'];
          // console.log("spec: ",spec)
          // this.spec = spec
        },
        immediate: true
      },
      "$store.state.pioneerLive": {
        handler: function() {
          // const pioneerLive = this.$store.getters['getPioneerLive'];
          // console.log("pioneerLive: ",pioneerLive)
          // this.pioneerLive = pioneerLive
        },
        immediate: true
      }
    },
    methods: {
      ...mapMutations(['showModal','hideModal']),
      onSubmit: async function () {
        console.log("onSubmit")
      },
      onAccept(name) {
        console.log("name: ",name)
        //update url
        let serverSelect = this.availableServers.filter(e => e.name === name)[0]
        this.spec = serverSelect.spec

        this.$q.electron.ipcRenderer.send('openLink', {url:serverSelect.docs});

      },
      onServerClick(name) {
        console.log("name: ",name)
        this.isTesting = false
        this.isAccepted = true
        //update url
        let serverSelect = this.availableServers.filter(e => e.name === name)[0]
        this.$q.electron.ipcRenderer.send('updateServerSelection', serverSelect);

        this.onTest()
        //test url
      },
      openDocs(name) {
        console.log("name: ",name)
        //update url
        let serverSelect = this.availableServers.filter(e => e.name === name)[0]
        this.$q.electron.ipcRenderer.send('openLink', {url:serverSelect.docs});
        //test server
      },
      onTest() {
        this.isTesting = true
        //update url
        console.log("spec: ",this.spec)
        this.$q.electron.ipcRenderer.send('checkPioneerUrls', {servers:this.availableServers});
      },
      onReset () {
        this.username = null
      },
      openSetup: function () {
        this.hideModal()
        //open setup
        this.showModal('SetupUsername')
      }
    }
  }
</script>
