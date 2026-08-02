---
permalink: /blog/
title: "Moments"
author_profile: false
layout: moment-index
moment_filters:
  - "JD"
  - "Tencent"
  - "JNU"
  - "Research"
  - "Campus"
  - "Travel"
  - "Life"
  - "Sports"
  - "Reflection"
moment_calendar_years:
  - 2026
  - 2025
  - 2024
  - 2023
---

<header class="moment-index-header">
  <span class="moment-index-kicker">LIFE LOG</span>
  <h1>Moments</h1>
  <p>Fragments of research, work, travel, and ordinary days that I would like to remember.</p>
</header>

{% assign all_moments = site.pages | where: "moment_post", true | sort: "moment_date" | reverse %}
{% if jekyll.environment == "production" %}
  {% assign moments = all_moments | where: "moment_public", true %}
{% else %}
  {% assign moments = all_moments %}
{% endif %}

{% if moments.size > 0 %}
<div class="moment-list" id="moment-list">
  {% for moment in moments %}
  <article
    class="moment-card blog-reveal"
    data-moment-card
    data-moment-tags="{{ moment.moment_tags | join: '|' | downcase | escape }}"
    data-moment-year="{{ moment.moment_date | date: '%Y' }}"
    data-moment-month="{{ moment.moment_date | date: '%m' }}"
  >
    <time class="moment-card__date" datetime="{{ moment.moment_date | date_to_xmlschema }}">
      <strong>{{ moment.moment_date | date: "%-d" }}</strong>
      <span>{{ moment.moment_date | date: "%b" }}</span>
      <small>{{ moment.moment_date | date: "%Y" }}</small>
    </time>

    <a class="moment-card__cover" href="{{ moment.url }}">
      {% if moment.moment_cover %}
      <img
        src="{{ moment.moment_cover | prepend: site.baseurl }}"
        alt="{{ moment.moment_cover_alt | default: moment.title }}"
        loading="lazy"
      >
      {% else %}
      <span class="moment-card__cover-placeholder" aria-hidden="true">M</span>
      {% endif %}
      {% if moment.moment_demo %}
      <span class="moment-card__demo">LOCAL PREVIEW</span>
      {% endif %}
    </a>

    <div class="moment-card__body">
      <h2><a href="{{ moment.url }}">{{ moment.title }}</a></h2>

      {% if moment.moment_summary %}
      <p>{{ moment.moment_summary }}</p>
      {% endif %}

      {% if moment.moment_tags %}
      <div class="moment-card__tags">
        {% for tag in moment.moment_tags %}
        <span>{{ tag }}</span>
        {% endfor %}
      </div>
      {% endif %}

      <div class="moment-card__footer">
        {% if moment.moment_location %}
        <span>{{ moment.moment_location }}</span>
        {% endif %}
        <a href="{{ moment.url }}">Read moment <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </article>
  {% endfor %}
</div>

<div class="moment-filter-empty" id="moment-filter-empty" hidden>
  No moments match these filters yet.
</div>
{% else %}
<div class="moment-index-empty">
  <span>🌱</span>
  <h2>The first moment is on the way.</h2>
  <p>This space will collect everyday observations, milestones, and memories beyond a formal CV.</p>
</div>
{% endif %}
