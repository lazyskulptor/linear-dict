<script>
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <title>Linear Dict - Word-by-Word Interlinear Translation & Dictionary</title>
  <meta name="description" content="Linear Dict is a free online interlinear translation tool. Analyze any text word-by-word with contextual meaning, dictionary definitions, and part-of-speech tags. Supports English, Chinese, Japanese, Korean, Russian, Spanish, French, and German." />
  <meta name="keywords" content="linear dictionary, interlinear translation, word-by-word translation, interlinear bible, language analysis, dictionary, multilingual translator, text analysis tool" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Linear Dict - Word-by-Word Interlinear Translation" />
  <meta property="og:description" content="Free online interlinear translation tool. Analyze text word-by-word with contextual meaning, dictionary definitions, and part-of-speech tags across 8 languages." />
  <meta property="og:site_name" content="Linear Dict" />
  <meta property="og:url" content="https://linear.sooda.life" />
  <meta property="og:image" content="https://linear.sooda.life/og-image.png" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Linear Dict - Word-by-Word Interlinear Translation" />
  <meta name="twitter:description" content="Free online interlinear translation tool. Analyze text word-by-word with contextual meaning, dictionary definitions, and part-of-speech tags across 8 languages." />
  <meta name="twitter:image" content="https://linear.sooda.life/og-image.png" />

  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://linear.sooda.life" />
</svelte:head>

{@render children()}
