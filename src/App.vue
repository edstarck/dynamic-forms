<template>
  <div id="app" class="container mx-auto py-6">
    <header>
      <div>
        <span id="logo">Liquid Gold Box</span>
      </div>
    </header>

    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormWizardApp',
}
</script>
