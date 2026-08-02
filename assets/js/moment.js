(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-moment-card]'));
  var tagFilters = Array.prototype.slice.call(document.querySelectorAll('[data-moment-filter]'));
  var calendar = document.querySelector('[data-moment-calendar]');
  var yearNavigator = document.querySelector('[data-moment-year-nav]');
  var previousYearButton = document.querySelector('[data-moment-year-previous]');
  var nextYearButton = document.querySelector('[data-moment-year-next]');
  var yearDisplay = document.querySelector('[data-moment-year-display]');
  var monthFilterContainer = document.querySelector('[data-moment-month-filter]');
  var dateReset = document.querySelector('[data-moment-date-reset]');
  var emptyState = document.getElementById('moment-filter-empty');
  var monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  function normalize(value) {
    return (value || '').trim().toLowerCase();
  }

  function cardTags(card) {
    return normalize(card.getAttribute('data-moment-tags'))
      .split('|')
      .filter(Boolean);
  }

  function cardYear(card) {
    return normalize(card.getAttribute('data-moment-year'));
  }

  function cardMonth(card) {
    return normalize(card.getAttribute('data-moment-month'));
  }

  var availableYears = cards
    .map(cardYear)
    .filter(function (year, index, values) {
      return year && values.indexOf(year) === index;
    });
  var currentYear = String(new Date().getFullYear());
  var configuredYears = yearNavigator
    ? normalize(yearNavigator.getAttribute('data-calendar-years')).split(',').filter(Boolean)
    : [];
  var years = configuredYears
    .concat(availableYears)
    .concat([currentYear])
    .filter(function (year, index, values) {
      return year && values.indexOf(year) === index;
    })
    .sort(function (a, b) {
      return Number(a) - Number(b);
    });

  if (calendar && years.length === 0) calendar.hidden = true;

  if (monthFilterContainer) {
    monthNames.forEach(function (monthName, index) {
      var month = String(index + 1).padStart(2, '0');
      var button = document.createElement('button');
      var label = document.createElement('span');
      var count = document.createElement('small');

      button.type = 'button';
      button.setAttribute('data-moment-month', month);
      button.setAttribute('aria-pressed', 'false');
      label.textContent = monthName;
      count.setAttribute('aria-hidden', 'true');
      button.appendChild(label);
      button.appendChild(count);
      monthFilterContainer.appendChild(button);
    });
  }
  var monthFilters = monthFilterContainer
    ? Array.prototype.slice.call(monthFilterContainer.querySelectorAll('[data-moment-month]'))
    : [];
  var activeTag = 'all';
  var activeYear = 'all';
  var activeMonth = 'all';

  function hasOption(buttons, attribute, value) {
    return buttons.some(function (button) {
      return normalize(button.getAttribute(attribute)) === normalize(value);
    });
  }

  function countMoments(year, month) {
    return cards.filter(function (card) {
      var matchesYear = year === 'all' || cardYear(card) === year;
      var matchesMonth = month === 'all' || cardMonth(card) === month;
      return matchesYear && matchesMonth;
    }).length;
  }

  function activityLevel(count) {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    return 3;
  }

  function countLabel(count) {
    return count + (count === 1 ? ' moment' : ' moments');
  }

  function updateCalendar() {
    var yearIndex = years.indexOf(activeYear);
    if (yearDisplay) yearDisplay.textContent = activeYear === 'all' ? '--' : activeYear;

    if (previousYearButton) {
      var previousYear = activeYear === 'all' ? currentYear : years[yearIndex - 1];
      previousYearButton.disabled = activeYear !== 'all' && yearIndex <= 0;
      previousYearButton.setAttribute(
        'aria-label',
        previousYear ? 'Show ' + previousYear : 'No earlier year'
      );
      previousYearButton.title = previousYear ? 'Show ' + previousYear : 'No earlier year';
    }

    if (nextYearButton) {
      var nextYear = activeYear === 'all' ? currentYear : years[yearIndex + 1];
      nextYearButton.disabled = activeYear !== 'all' && yearIndex >= years.length - 1;
      nextYearButton.setAttribute(
        'aria-label',
        nextYear ? 'Show ' + nextYear : 'No later year'
      );
      nextYearButton.title = nextYear ? 'Show ' + nextYear : 'No later year';
    }

    monthFilters.forEach(function (button, index) {
      var month = normalize(button.getAttribute('data-moment-month'));
      var count = countMoments(activeYear, month);
      var active = month === activeMonth;
      var scope = activeYear === 'all' ? ' across all years' : ' in ' + activeYear;
      var countElement = button.querySelector('small');

      button.disabled = count === 0;
      button.setAttribute('data-level', String(activityLevel(count)));
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      button.setAttribute('aria-label', monthNames[index] + ', ' + countLabel(count) + scope);
      button.title = countLabel(count) + ' in ' + monthNames[index] + scope;
      if (countElement) countElement.textContent = count > 0 ? String(count) : '–';
    });

    if (dateReset) {
      var resetActive = activeYear === 'all' && activeMonth === 'all';
      dateReset.classList.toggle('is-active', resetActive);
      dateReset.setAttribute('aria-pressed', resetActive ? 'true' : 'false');
    }
  }

  function applyFilters(updateHistory) {
    var visibleCount = 0;

    tagFilters.forEach(function (button) {
      var active = normalize(button.getAttribute('data-moment-filter')) === activeTag;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    updateCalendar();

    cards.forEach(function (card) {
      var matchesTag = activeTag === 'all' || cardTags(card).indexOf(activeTag) !== -1;
      var matchesYear = activeYear === 'all' || cardYear(card) === activeYear;
      var matchesMonth = activeMonth === 'all' || cardMonth(card) === activeMonth;
      var visible = matchesTag && matchesYear && matchesMonth;
      card.hidden = !visible;
      if (!visible) {
        if (card._momentRevealTimer) {
          window.clearTimeout(card._momentRevealTimer);
          card._momentRevealTimer = null;
        }
        card.classList.remove('blog-reveal--in');
      }
      if (visible) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount !== 0;

    if (updateHistory && window.history && window.URL) {
      var url = new URL(window.location.href);
      if (activeTag === 'all') {
        url.searchParams.delete('tag');
      } else {
        url.searchParams.set('tag', activeTag);
      }
      if (activeYear === 'all') {
        url.searchParams.delete('year');
      } else {
        url.searchParams.set('year', activeYear);
      }
      if (activeMonth === 'all') {
        url.searchParams.delete('month');
      } else {
        url.searchParams.set('month', activeMonth);
      }
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    }
  }

  tagFilters.forEach(function (button) {
    button.addEventListener('click', function () {
      activeTag = normalize(button.getAttribute('data-moment-filter')) || 'all';
      applyFilters(true);
    });
  });

  function enterCurrentYear() {
    activeYear = years.indexOf(currentYear) !== -1
      ? currentYear
      : years[years.length - 1];
    activeMonth = 'all';
  }

  if (previousYearButton) {
    previousYearButton.addEventListener('click', function () {
      if (activeYear === 'all') {
        enterCurrentYear();
      } else {
        var previousIndex = years.indexOf(activeYear) - 1;
        if (previousIndex >= 0) activeYear = years[previousIndex];
      }
      activeMonth = 'all';
      applyFilters(true);
    });
  }

  if (nextYearButton) {
    nextYearButton.addEventListener('click', function () {
      if (activeYear === 'all') {
        enterCurrentYear();
      } else {
        var nextIndex = years.indexOf(activeYear) + 1;
        if (nextIndex < years.length) activeYear = years[nextIndex];
      }
      activeMonth = 'all';
      applyFilters(true);
    });
  }

  monthFilters.forEach(function (button) {
    button.addEventListener('click', function () {
      var month = normalize(button.getAttribute('data-moment-month'));
      activeMonth = activeMonth === month ? 'all' : month;
      applyFilters(true);
    });
  });

  if (dateReset) {
    dateReset.addEventListener('click', function () {
      activeYear = 'all';
      activeMonth = 'all';
      applyFilters(true);
    });
  }

  var requestedTag = 'all';
  var requestedYear = 'all';
  var requestedMonth = 'all';
  if (window.URL) {
    var initialUrl = new URL(window.location.href);
    requestedTag = initialUrl.searchParams.get('tag') || 'all';
    requestedYear = initialUrl.searchParams.get('year') || 'all';
    requestedMonth = initialUrl.searchParams.get('month') || 'all';
  }
  if (!hasOption(tagFilters, 'data-moment-filter', requestedTag)) {
    requestedTag = 'all';
  }
  if (requestedYear !== 'all' &&
      years.indexOf(normalize(requestedYear)) === -1) {
    requestedYear = 'all';
  }
  if (requestedMonth !== 'all' &&
      (!hasOption(monthFilters, 'data-moment-month', requestedMonth) ||
       countMoments(normalize(requestedYear), normalize(requestedMonth)) === 0)) {
    requestedMonth = 'all';
  }
  activeTag = normalize(requestedTag);
  activeYear = normalize(requestedYear);
  activeMonth = normalize(requestedMonth);
  applyFilters(false);

  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.blog-reveal'));
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealItems.forEach(function (item) {
      item.classList.add('blog-reveal--in');
    });
    return;
  }

  var revealStartedAt = window.performance.now();
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var item = entry.target;

      if (!entry.isIntersecting) {
        if (item._momentRevealTimer) {
          window.clearTimeout(item._momentRevealTimer);
          item._momentRevealTimer = null;
        }

        if (entry.boundingClientRect.bottom < 0) {
          item.classList.add('blog-reveal--from-above');
        } else {
          item.classList.remove('blog-reveal--from-above');
        }

        if (item.hasAttribute('data-moment-revealed')) {
          item.classList.remove('blog-reveal--in');
        }
        return;
      }

      var firstReveal = !item.hasAttribute('data-moment-revealed');
      var itemIndex = revealItems.indexOf(item);
      var isInitialBatch = firstReveal &&
        window.performance.now() - revealStartedAt < 1800;
      var delay = isInitialBatch ? 120 + Math.min(itemIndex, 4) * 240 : 0;

      item.style.setProperty('--moment-reveal-delay', '0ms');
      item.setAttribute('data-moment-revealed', 'true');

      var showItem = function () {
        item._momentRevealTimer = null;
        item.classList.add('blog-reveal--in');
      };

      if (delay > 0) {
        item._momentRevealTimer = window.setTimeout(function () {
          window.requestAnimationFrame(showItem);
        }, delay);
      } else {
        window.requestAnimationFrame(showItem);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '40px 0px 40px 0px'
  });

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
})();
