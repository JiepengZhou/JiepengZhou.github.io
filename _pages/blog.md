---
permalink: /blog/
title: "Blog"
author_profile: false
layout: detail
---

<h1 style="margin-top:0;">📝 Blog</h1>
<p style="color:#9ca3af;font-size:0.9em;margin-bottom:2rem;">You found the secret page! Here are some personal thoughts.</p>

{% assign blog_posts = site.pages | where: "blog_post", true | sort: "blog_date" | reverse %}
{% assign grouped = blog_posts | group_by_exp: "post", "post.blog_date | date: '%Y'" %}

{% for year in grouped %}
<div class="blog-year">
  <h2 class="blog-year__title">{{ year.name }}</h2>

  {% for post in year.items %}
  <div class="blog-row blog-reveal">
    <div class="blog-row__date">{{ post.blog_date | date: "%b %-d" }}</div>
    <article class="blog-card">
      {% if post.blog_image %}
      <div class="blog-card__thumb">
        <img src="{{ post.blog_image }}" alt="{{ post.title }}" />
      </div>
      {% endif %}
      <div class="blog-card__body">
        <h3 class="blog-card__title">{{ post.title }}</h3>
        <a class="blog-card__more" href="{{ post.url }}">More</a>
      </div>
    </article>
  </div>
  {% endfor %}

</div>
{% endfor %}

<script>
(function(){
  var els = document.querySelectorAll('.blog-reveal');
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('blog-reveal--in');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.1});
  els.forEach(function(el){ observer.observe(el); });
})();
</script>
