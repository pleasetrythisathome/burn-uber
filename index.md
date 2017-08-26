---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: default
---

<main class="page-content" aria-label="Content">
  {% include google_map.html %}
</main>
{% include request_form.html %}
{% include request_button.html %}
{% include destination_input.html %}
{% include landing.html %}

<script type="text/javascript">
  $(document).ready(initBurnerUber);
</script>
