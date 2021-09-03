<template>
  <q-card class="text-center q-pb-lg" style="min-width:450px;">
    <q-card-section>
      <h4>Attempting to Connect Keepkey!</h4>
      <small>Status: {{keepKeyStatus}}</small>
      <q-spinner
        color="primary"
        size="5rem"
        v-if="!isLoaded"
        key="spinner"
      />
    </q-card-section>

    <div class="q-pa-md">
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          popup
          expand-icon-toggle
          expand-separator
          icon="computer"
          label="USB drivers Found for OS"
          caption="(KeepKey)"
          v-ripple
          :header-class="driversValid ? 'text-green' : ''"
          :disable="driversValid"
        >
          <q-card>
            <q-card-section>
              The Drivers For the Hardware Wallet were found on this Computer.
            </q-card-section>
          </q-card>
        </q-expansion-item>

      <q-expansion-item
        popup
        expand-icon-toggle
        expand-separator
        icon="devices"
        label="Keepkey Connected to Computer"
        v-ripple
        :header-class="keepKeyConnectedComputer ? 'text-green' : ''"
        :disable="keepKeyConnectedComputer"
      >
        <q-card>
          <q-card-section>
            <div>
              All Keepkeys: {{allKeepKeys}}
            </div>
            <div class="on-left">
              All Devices:
              <ul compact>
              <div
                v-for="device in allUsbDevices"
                :key="device.deviceName"
                style="text-align: left">
                <li>{{device.deviceName}} <div style="text-align: right"><small>usbId: {{device.locationId}}</small></div></li>
                <div v-if="device.deviceName === 'KeepKey'">
                  <q-icon icon=""></q-icon>
                  {{device}}
                </div>
              </div>
              </ul>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        popup
        expand-icon-toggle
        expand-separator
        icon="explore"
        label="Keepkey Connected to Application"
        v-ripple
        :header-class="keepKeyConnectedApplication ? 'text-green' : ''"
        :disable="keepKeyConnectedApplication"
      >
        <q-card>
          <q-card-section>
            Keepkey Connected to Application

            <div v-if="!keepKeyConnectedApplication">
              <h5>Failed to claim Error!</h5>
              <ol>
                <li>Unplug Keepkey Device!</li>
                <li>Close ALL browser tabs</li>
                <li>Close The KeepKey Updater App (if installed)</li>
                <li>Close Any other applications that may connect to the keepKey</li>
                <li>reconnect KeepKey</li>
              </ol>
            </div>


          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        popup
        expand-icon-toggle
        expand-separator
        icon="lock_open"
        label="Keepkey Unlocked"
        v-ripple
        :active="keepKeyUnlocked"
        :header-class="keepKeyUnlocked ? 'text-green' : ''"
        :disable="keepKeyUnlocked"
      >
        <q-card>
          <q-card-section>
            Keepkey Unlocked
            open pin:
          </q-card-section>
        </q-card>
      </q-expansion-item>

        <q-expansion-item
          popup
          expand-icon-toggle
          expand-separator
          icon="offline_share"
          label="Keepkey Paired with Application"
          v-ripple
          :active="keepKeyPaired"
          :header-class="keepKeyPaired ? 'text-green' : ''"
          :disable="keepKeyPaired"
        >
          <q-card>
            <q-card-section>
              <div>
                {{devices}}
              </div>
              Keepkey Wallet file generated from pubkeys.

              <div>
                <small>dir /.pioneer/wallets/deviceId*.watch.wallet.json</small>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

      </q-list>
    </div>

    <q-card-actions vertical align="center" class="q-pb-lg">
      <q-form
        class="q-gutter-md"
      >

        <q-btn
          @click="goBack"
          class="full-width"
          align="left"
          size="lg"
          label="Go Back"
        />

      </q-form>

    </q-card-actions>
  </q-card>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'
  import {ipcRenderer} from "electron";
    export default {
      name: "HardwareConnect",
      data() {
        return {
          keepKeyStatus:'',
          onSuccess:false,
          keepKeyState:0,
          allUsbDevices:[],
          allKeepKeys:[],
          devices:[],
          firmwareVersion:"",
          activeColor:"header-green",
          keepKeyPaired:false,
          firmwareUpdateRequired:false,
          isLoaded:false,
          driversValid: true,
          active:true,
          usbDevices:0,
          keepKeyInUsbList:false,
          keepKeyConnectedComputer:false,
          keepKeyConnectedApplication:false,
          keepKeyUnlocked:false
        };
      },
      mounted() {
        try{
          //startHardware
          this.getUsbInfo()
          this.startHardwareConnection()

          //sub to hardware
          //TODO why the f do I need this, and watcher not work?
          ipcRenderer.on('hardwareState', (event, data) => {
            console.log('HARDWARE COMPONENT hardwareState state: ', data.state)
            if(data && data.state){
              if(data.state.state === -1){
                this.keepKeyStatus = 'Device already Claimed! can not continue... '
                alert(" KeepKey device is claimed by a seperate Application! \n 1. please close all browser tabs \n 2. exit any other keepkey applications \n 3. disconect device  \n 4. reconnect device")
              }


              if(data.state.state === 4){

                this.keepKeyUnlocked = true
                this.keepKeyConnectedComputer = true
                this.keepKeyInUsbList = true
                this.keepKeyConnectedApplication = true
                this.isLoaded = true
                this.keepKeyStatus = 'UnLocked!'
                this.pairHardware()
                //only start once
                if(!this.onSuccess)setTimeout(this.openStartup,1000)
                this.onSuccess = true
              }
            }
          })
        }catch(e){
          console.error(e)
        }
      },
      watch: {
        "$store.state.devices": {
          handler: function() {
            this.devices = this.$store.getters['getDevices'];
            console.log("devices: ",this.devices)
            //TODO multiple devices
            //if any connected device without wallet then dont continue
            if(this.devices.length > 0){
              //is paired
              //continue
              setTimeout(this.openStartup,1000)
            }
          },
          immediate: true
        },
        "$store.state.keepKeyStatus": {
          handler: function() {
            this.keepKeyStatus = this.$store.getters['getKeepKeyStatus'];
            console.log("*** getKeepKeyStatus: ",this.keepKeyStatus)
            if(this.keepKeyStatus && this.keepKeyStatus.status === "unlocked"){
              this.keepKeyUnlocked = true
              this.keepKeyConnectedComputer = true
              this.keepKeyInUsbList = true
              this.keepKeyConnectedApplication = true
              this.isLoaded = true
              this.keepKeyStatus = 'UnLocked!'
            }
          },
          immediate: true
        },
        "$store.state.keepKeyState": {
          handler: function() {
            this.keepKeyState = this.$store.getters['getKeepKeyState'];
            console.log("*** keepKeyState: ",this.keepKeyState)
            if(this.keepKeyState && this.keepKeyState.state === 4){
              this.keepKeyUnlocked = true
              this.keepKeyConnectedComputer = true
              this.keepKeyInUsbList = true
              this.keepKeyConnectedApplication = true
              this.isLoaded = true
              this.keepKeyStatus = 'UnLocked!'
            }
          },
          immediate: true
        },
        "$store.state.allKeepKeys": {
          handler: function() {
            this.allKeepKeys = this.$store.getters['getAllKeepKeys'];
            if(this.allKeepKeys.length > 0){
              console.log("Keepkey found!")
              this.keepKeyStatus = 'Device Found! attempting to connect...'
              this.keepKeyConnectedComputer = true
            }
            console.log("allKeepKeys: ",this.allKeepKeys)
          },
          immediate: true
        },
        "$store.state.allUsbDevices": {
          handler: function() {
            this.allUsbDevices = this.$store.getters['getAllUsbDevices'];
            console.log("allUsbDevices: ",this.allUsbDevices)
          },
          immediate: true
        },
      },
      computed: {
        ...mapGetters(['getAllUsbDevices','getAllKeepKeys','getKeepKeyState','getKeepKeyStatus']),
      },
      methods: {
        ...mapMutations(['showModal','hideModal']),
        //...mapGetters(['getAllUsbDevices','getAllKeepKeys','getKeepKeyState','getKeepKeyStatus']),
        pairHardware: function () {
          console.log("pairing hardware!")
          this.$q.electron.ipcRenderer.send('onPairKeepKey', {});
        },
        getUsbInfo: function () {
          //
          this.$q.electron.ipcRenderer.send('getUsbDevices', {});
        },
        startHardwareConnection: function () {
          //
          this.$q.electron.ipcRenderer.send('startHardware', {});
        },
        openStartup: function () {
          this.hideModal()
          this.showModal('Startup')
        },
        openRestore: function () {
          this.hideModal()
          this.showModal('Restore')
        },
        goBack: function () {
          this.hideModal()
          this.showModal('Setup')
        },
        close: function () {
          this.hideModal()
        }
    }
  }
</script>

<style scoped>

</style>
