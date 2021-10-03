<template>
    <div class="menu-create">
        <create-or-edit :is-edit="false" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './components/CreateOrEdit.vue'
export default Vue.extend({
  name: 'CreateMenuIndex',
  components: {
    CreateOrEdit
  }
})
</script>

<style lang="scss" scoped>

</style>
