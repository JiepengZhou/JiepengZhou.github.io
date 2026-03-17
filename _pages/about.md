---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<section class="home-section" id="about-me">
  <h2 class="home-section__title">👋 Welcome！</h2>
  <div class="home-section__body" markdown="1">

Here is a homepage about Jiepeng.

  </div>
  <div class="about-actions">
    <a href="../assets/Jiepeng_Zhou_CV.pdf" class="about-btn" target="_blank" rel="noopener">English CV</a>
    <a href="../assets/Jiepeng_Zhou_CV_CN.pdf" class="about-btn" target="_blank" rel="noopener">中文简历</a>
    <div class="about-contact">
      <button type="button" class="about-btn about-btn--secondary">Contact</button>
      <div class="about-contact-card">
        <div class="about-contact-card__row">
          <span class="about-contact-card__label">Phone</span>
          <span class="about-contact-card__value">{{ site.author.phone }}</span>
        </div>
        <div class="about-contact-card__row">
          <span class="about-contact-card__label">WeChat</span>
          <span class="about-contact-card__value">{{ site.author.wechat }}</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="home-section" id="educations">
  <h2 class="home-section__title">📖 Educations</h2>
  <div class="home-section__body" markdown="1">

    {% capture _education_raw %}{% include_relative education.md %}{% endcapture %}
    {% assign _education_body = _education_raw | split: '---' | last %}
    {% assign _education_body = _education_body | replace_first: '# 📖 Educations', '' %}
    {{ _education_body | markdownify }}

  </div>
</section>

<section class="home-section" id="publications">
  <h2 class="home-section__title">📝 Publications</h2>
  <div class="home-section__body" markdown="1">

    {% capture _publications_raw %}{% include_relative publications.md %}{% endcapture %}
    {% assign _publications_body = _publications_raw | split: '---' | last %}
    {% assign _publications_body = _publications_body | replace_first: '# 📝 Publications', '' %}
    {{ _publications_body | markdownify }}

  </div>
</section>

<section class="home-section" id="internships">
  <h2 class="home-section__title">💻 Internships</h2>
  <div class="home-section__body" markdown="1">

    {% capture _internships_raw %}{% include_relative internships.md %}{% endcapture %}
    {% assign _internships_body = _internships_raw | split: '---' | last %}
    {% assign _internships_body = _internships_body | replace_first: '# 💻 Internships', '' %}
    {{ _internships_body | markdownify }}

  </div>
</section>

<section class="home-section" id="honors-and-awards">
  <h2 class="home-section__title">🎖 Honors and Awards</h2>
  <div class="home-section__body" markdown="1">

    {% capture _honors_raw %}{% include_relative honors.md %}{% endcapture %}
    {% assign _honors_body = _honors_raw | split: '---' | last %}
    {% assign _honors_body = _honors_body | replace_first: '# 🎖 Honors and Awards', '' %}
    {{ _honors_body | markdownify }}

  </div>
</section>

<section class="home-section" id="competitions">
  <h2 class="home-section__title">💬 Competitions</h2>
  <div class="home-section__body" markdown="1">

    {% capture _competitions_raw %}{% include_relative competitions.md %}{% endcapture %}
    {% assign _competitions_body = _competitions_raw | split: '---' | last %}
    {% assign _competitions_body = _competitions_body | replace_first: '# 💬 Competitions', '' %}
    {{ _competitions_body | markdownify }}

  </div>
</section>
