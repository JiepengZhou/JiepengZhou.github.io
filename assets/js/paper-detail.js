(function () {
  var content = document.getElementById('paper-detail-content');
  var tocList = document.getElementById('paper-toc-list');
  var tocIndicator = document.getElementById('paper-toc-indicator');
  var positionBar = document.getElementById('paper-position-bar');
  var article = document.querySelector('.paper-detail-article');
  if (!content || !tocList || !positionBar || !article) return;

  var headings = Array.prototype.slice.call(content.querySelectorAll('h2'));
  var tocLinks = [];
  var framePending = false;
  var optionalProgress = document.querySelector('[data-detail-progress]');
  var optionalToc = document.querySelector('[data-detail-toc]');

  if (optionalProgress) {
    var minimumSections = parseInt(optionalProgress.getAttribute('data-min-sections'), 10) || 1;
    optionalProgress.hidden = headings.length < minimumSections;
  }
  if (optionalToc) optionalToc.hidden = headings.length === 0;

  function slugify(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/<[^>]*>/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  headings.forEach(function (heading, index) {
    if (!heading.id) heading.id = slugify(heading.textContent) || 'section-' + (index + 1);

    var item = document.createElement('li');
    item.className = 'paper-detail-toc__item paper-detail-toc__item--' + heading.tagName.toLowerCase();

    var link = document.createElement('a');
    link.href = '#' + heading.id;
    link.textContent = heading.textContent;
    link.addEventListener('click', function (event) {
      event.preventDefault();
      var top = heading.getBoundingClientRect().top + window.pageYOffset - 28;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
      history.replaceState(history.state, '', '#' + heading.id);
    });

    item.appendChild(link);
    tocList.appendChild(item);
    tocLinks.push(link);
  });

  function moveTocIndicator(activeIndex) {
    if (!tocIndicator || !tocLinks[activeIndex]) return;
    var navigationRect = tocIndicator.parentNode.getBoundingClientRect();
    var linkRect = tocLinks[activeIndex].getBoundingClientRect();
    var x = linkRect.left - navigationRect.left;
    var y = linkRect.top - navigationRect.top;

    tocIndicator.style.width = linkRect.width + 'px';
    tocIndicator.style.height = linkRect.height + 'px';
    tocIndicator.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
    tocIndicator.classList.add('is-visible');
  }

  function updatePagePosition() {
    framePending = false;

    var scrollY = window.pageYOffset;
    var articleRect = article.getBoundingClientRect();
    var articleTop = articleRect.top + scrollY;
    var articleEndScroll = Math.max(1, articleTop + article.offsetHeight - window.innerHeight);
    var atArticleEnd = articleRect.bottom <= window.innerHeight + 2 ||
      scrollY >= articleEndScroll - 2;
    var progress = atArticleEnd
      ? 1
      : Math.min(1, Math.max(0, scrollY / articleEndScroll));
    positionBar.style.width = (progress * 100).toFixed(2) + '%';

    if (!headings.length) return;
    var marker = scrollY + Math.min(180, window.innerHeight * 0.28);
    var activeIndex = atArticleEnd ? headings.length - 1 : 0;

    if (!atArticleEnd) {
      headings.forEach(function (heading, index) {
        var headingTop = heading.getBoundingClientRect().top + scrollY;
        if (headingTop <= marker) activeIndex = index;
      });
    }

    tocLinks.forEach(function (link, index) {
      var active = index === activeIndex;
      link.classList.toggle('is-active', active);
      if (active) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
    moveTocIndicator(activeIndex);
  }

  function schedulePagePosition() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updatePagePosition);
  }

  window.addEventListener('scroll', schedulePagePosition, { passive: true });
  window.addEventListener('resize', schedulePagePosition);
  window.addEventListener('load', schedulePagePosition);
  tocList.addEventListener('scroll', schedulePagePosition, { passive: true });
  schedulePagePosition();

  function enhanceGallery(gallery) {
    var items = Array.prototype.slice.call(gallery.children);
    if (items.length < 2) return;

    var shell = document.createElement('div');
    shell.className = 'paper-gallery-shell';
    gallery.parentNode.insertBefore(shell, gallery);
    shell.appendChild(gallery);
    gallery.classList.add('is-enhanced');

    var controls = document.createElement('div');
    controls.className = 'paper-gallery-controls';

    var status = document.createElement('span');
    status.className = 'paper-gallery-status';

    var actions = document.createElement('span');
    actions.className = 'paper-gallery-actions';

    var previousControl = document.createElement('button');
    previousControl.type = 'button';
    previousControl.className = 'paper-gallery-control';
    previousControl.setAttribute('aria-label', 'Show previous figure');
    previousControl.textContent = '‹';

    var nextControl = document.createElement('button');
    nextControl.type = 'button';
    nextControl.className = 'paper-gallery-control';
    nextControl.setAttribute('aria-label', 'Show next figure');
    nextControl.textContent = '›';

    actions.appendChild(previousControl);
    actions.appendChild(nextControl);
    controls.appendChild(status);
    controls.appendChild(actions);
    shell.appendChild(controls);

    var activeIndex = 0;
    var galleryFramePending = false;

    function updateGallery(index) {
      activeIndex = Math.max(0, Math.min(items.length - 1, index));
      status.textContent = 'Figure ' + (activeIndex + 1) + ' / ' + items.length;
      previousControl.disabled = activeIndex === 0;
      nextControl.disabled = activeIndex === items.length - 1;
      gallery.style.height = items[activeIndex].offsetHeight + 'px';
    }

    function nearestItemIndex() {
      var nearestIndex = 0;
      var nearestDistance = Infinity;
      items.forEach(function (item, index) {
        var distance = Math.abs(item.offsetLeft - gallery.scrollLeft);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });
      return nearestIndex;
    }

    function goTo(index) {
      var targetIndex = Math.max(0, Math.min(items.length - 1, index));
      gallery.scrollTo({
        left: items[targetIndex].offsetLeft,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
      updateGallery(targetIndex);
    }

    previousControl.addEventListener('click', function () {
      goTo(activeIndex - 1);
    });
    nextControl.addEventListener('click', function () {
      goTo(activeIndex + 1);
    });
    gallery.addEventListener('scroll', function () {
      if (galleryFramePending) return;
      galleryFramePending = true;
      requestAnimationFrame(function () {
        galleryFramePending = false;
        updateGallery(nearestItemIndex());
      });
    }, { passive: true });
    window.addEventListener('resize', function () {
      gallery.scrollLeft = items[activeIndex].offsetLeft;
      updateGallery(activeIndex);
    });
    items.forEach(function (item) {
      var image = item.querySelector('img');
      if (image && !image.complete) {
        image.addEventListener('load', function () {
          updateGallery(activeIndex);
          schedulePagePosition();
        });
      }
    });

    updateGallery(0);
  }

  Array.prototype.slice.call(article.querySelectorAll('.paper-gallery')).forEach(enhanceGallery);

  var lightbox = document.getElementById('paper-lightbox');
  var lightboxImage = lightbox && lightbox.querySelector('.paper-lightbox__image');
  var lightboxCaption = lightbox && lightbox.querySelector('.paper-lightbox__caption');
  var closeButton = lightbox && lightbox.querySelector('.paper-lightbox__close');
  var previousButton = lightbox && lightbox.querySelector('.paper-lightbox__nav--prev');
  var nextButton = lightbox && lightbox.querySelector('.paper-lightbox__nav--next');
  if (!lightbox || !lightboxImage || !closeButton || !previousButton || !nextButton) return;

  var currentImages = [];
  var currentIndex = 0;
  var lastTrigger = null;
  var previousOverflow = '';
  var zoomableImages = Array.prototype.slice.call(
    article.querySelectorAll('.paper-detail-hero img, .paper-detail-content img')
  );

  function imageCaption(image) {
    var figure = image.closest('figure');
    var caption = figure && figure.querySelector('figcaption');
    return caption ? caption.textContent.trim() : image.alt;
  }

  function showImage(index) {
    if (!currentImages.length) return;
    currentIndex = (index + currentImages.length) % currentImages.length;
    var image = currentImages[currentIndex];
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = imageCaption(image);
    lightboxCaption.hidden = !lightboxCaption.textContent;

    var hasMultiple = currentImages.length > 1;
    previousButton.hidden = !hasMultiple;
    nextButton.hidden = !hasMultiple;
  }

  function openLightbox(image) {
    var gallery = image.closest('.paper-gallery, .moment-gallery');
    currentImages = gallery
      ? Array.prototype.slice.call(gallery.querySelectorAll('img'))
      : [image];
    currentIndex = Math.max(0, currentImages.indexOf(image));
    lastTrigger = image;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    showImage(currentIndex);
    lightbox.hidden = false;
    closeButton.focus();
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    lightboxImage.src = '';
    document.body.style.overflow = previousOverflow;
    if (lastTrigger) lastTrigger.focus();
  }

  zoomableImages.forEach(function (image) {
    image.classList.add('paper-zoomable-image');
    image.setAttribute('tabindex', '0');
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', (image.alt || 'Image') + ' — open full-size preview');
    image.addEventListener('click', function () {
      openLightbox(image);
    });
    image.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  previousButton.addEventListener('click', function () {
    showImage(currentIndex - 1);
  });
  nextButton.addEventListener('click', function () {
    showImage(currentIndex + 1);
  });
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (event) {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
  });
})();
