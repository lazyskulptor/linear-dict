<script>
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <title>Linear Dict</title>
</svelte:head>

{@render children()}