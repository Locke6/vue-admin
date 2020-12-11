<template>
  <div>
    <div>{{ a }}</div>
    <button @click="$listeners['update:a']((a + 1) * 2)">按钮</button>
  </div>
</template>

<script>
export default {
  name: '',
  props: ['a'],
}
</script>

<style lang="less" scoped>
</style>
