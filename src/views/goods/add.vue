<template>
    <div  class="app-container">
      <detail :is-edit='false'></detail>
    </div>
</template>

<script>
  import detail from './components/detail'

  export default {
    name: 'createForm',
    components: { detail }
  }
</script>
