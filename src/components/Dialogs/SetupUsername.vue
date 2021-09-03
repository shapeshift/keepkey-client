<template>
  <q-card class="text-center q-pl-lg q-pr-lg" style="min-width:450px;">
    <small>Setup Username</small>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
    >
    <q-card-section>

        <p>Please create a user</p>
    </q-card-section>
    <q-card-section>
        <q-input
          filled
          v-model="username"
          label="Username"
          v-on:input="checkName"
          lazy-rules
          :rules="[ val => val && val.length > 3 || error]"
        />
    </q-card-section>
      <q-card-actions align="center" class="q-pb-lg q-pl-md q-pr-md">
        <small>online: {{usersOnlineCount}}</small>
        <small>users: {{usersOnline}}</small>
        <q-btn label="Continue" type="submit" color="primary" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script>
  /*

      Username Dialog

      Verify connected to pioneer:

      Offer changing of url if not live

   */
  let featureSelfHost = process.env['SELF_HOST_FEATURE']

  //TODO offer pre-generated name
  // import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

  //default servers
  //TODO download live servers from network


  import {mapGetters, mapMutations} from 'vuex'
  export default {
    data () {
      return {
        error:false,
        pioneerLive:false,
        usersOnline:[],
        usersOnlineCount:0,
        username: "",
        password:""
      }
    },
    computed: {
      ...mapGetters([]),
    },
    async mounted() {
      try{

        this.$q.electron.ipcRenderer.send('checkPioneerUrl', {});
      }catch(e){
        console.error(e)
      }
    },
    watch: {
    },
    methods: {
      ...mapMutations(['showModal','hideModal']),
      onSubmit: async function () {
        console.log("onSubmit")

        //update url


        //if password
        let payload = {
          username:this.username
        }
        if(this.usePassword){
          //check rules
          // > x
          console.log("password")
          payload.password = this.password
        }

        if(this.pioneerUrl){
          payload.urlSpec = this.pioneerUrl
        }

        this.$q.electron.ipcRenderer.send('onAttemptCreateUsername', payload);

        //check username

        //if username available
        //else clear username


        //if so continue
        // if(userInfoPublic.available){
        //   //set username to state
        //   this.$store.commit('setUsername',this.username)
        //
        // } else {
        //   this.onReset()
        //   this.error = "Username already taken!"
        //   this.$q.notify({
        //     color: 'red-5',
        //     textColor: 'white',
        //     icon: 'warning',
        //     message: this.error
        //   })
        // }
      },

      checkName () {
        //update url
        console.log("checkName: ",this.username)

        if(this.username.length > 3){
          //check on remote
          this.$q.electron.ipcRenderer.send('checkUsernameAvailable', {username:this.username});
        } else {
          this.error = "Too Short!"
        }

        //test url
      },
      onTest () {
        //update url
        console.log("pioneerUrl: ",this.pioneerUrl)
        this.$q.electron.ipcRenderer.send('checkPioneerUrl', {urlSpec:this.pioneerUrl});
        this.onSubmit()
        //test url
      },
      onReset () {
        this.username = null
      },
      openSetup: function () {
        this.hideModal()
        //open setup
        this.showModal('Setup')
      }
    }
  }
</script>
