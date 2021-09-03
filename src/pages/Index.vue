<template>
  <q-page class="flex flex-center">
    <h2>Dashboard: </h2>
  </q-page>
</template>

<script>

export default {
  name: 'PageIndex',
  data () {
    return {
      something: ''
    }
  },
  methods: {
    paste (evt) {
      console.log(evt)
    }
  }
}
</script>
