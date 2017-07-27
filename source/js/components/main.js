// debounce limits the amount of function invocation by spacing out the calls
// by at least `wait` ms.
function debounce(func, wait, immediate) {
  var timeout;

  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

// stripHTML strips HTML
function stripHTML(rawString) {
  var div = document.createElement("div");
  div.innerHTML = rawString;

  return div.textContent || div.innerText || "";
}

// excerpt creates an excerpt from the string, given max length
function excerpt(str, maxLen) {
  if (str.length <= maxLen) {
    return str;
  }

  return str.substring(0, maxLen) + "...";
}

// pickRandomItems returns n random items from an array
function pickRandomItems(arr, n) {
  return arr
    .slice()
    .sort(function() {
      return 0.5 - Math.random();
    })
    .slice(0, n + 1);
}

$(document).ready(function() {
  // ===========================================================================
  //
  // Notification banner for IE lt 9
  var ieNotification = $(".browsehappy");
  $(".browsehappy__dismiss").click(function() {
    ieNotification.remove();
  });

  // ===========================================================================
  //
  // SVG Fallback for older browsers

  if (!Modernizr.svg) {
    $('img[src$=".svg"]').each(function() {
      //Replace 'image.svg' with 'image.png'.
      $(this).attr("src", $(this).attr("src").replace(".svg", ".png"));
    });
  }

  // ===========================================================================
  //
  // Show menu navigation on smaller screen resolutions

  var menu = $(".page-nav__list");

  $("#page-nav-button").click(function() {
    menu.slideToggle(200);
  });

  $(window).on("resize", function() {
    if (!jQuery("#page-nav-button").is(":visible") && !menu.is(":visible")) {
      menu.css({ display: "" });
    }
  });

  // ===========================================================================
  //
  // Image panning
  // Homepage intro section

  function screenSize() {
    if ($(window).width() >= 990) {
      // panning();
    }
  }

  function panning() {
    $("body").mousemove(function(e) {
      var mousePosX = e.pageX / $(window).width() * 100;

      $(".bolt-image--top-front").css("left", mousePosX / 30 + "%");
      $(".bolt-image--top-back").css("right", mousePosX / 60 + "%");
      $(".bolt-image--bottom-front").css("left", mousePosX / 30 + "%");
      $(".bolt-image--bottom-back").css("left", mousePosX / 60 + "%");
    });
  }

  screenSize();

  $(window).resize(function() {
    screenSize();
  });

  // ===========================================================================
  //
  // Blog

  function closeGranular() {
    $(".js-granular-trigger").removeClass("is-active");
    $(".blog-nav-granular__item").slideUp(400).removeClass("is-open");
  }

  $(".js-granular-trigger").click(function(e) {
    // Grab current anchor value
    var currentAttrValue = $(this).attr("href");

    if ($(e.target).is(".is-active")) {
      closeGranular();
    } else {
      closeGranular();

      // Add is-active class to dropdown
      $(this).addClass("is-active");
      // Open up the hidden content panel
      $(".blog-nav-granular " + currentAttrValue)
        .slideDown(300)
        .addClass("is-open");
    }

    e.preventDefault();
  });

  // ===========================================================================
  //
  // Disqus comments section

  $(".js-reveal-comments").on("click", function() {
    var disqus_shortname = "skgamingtest"; // Replace this value with *your* username.

    // ajax request to load the disqus javascript
    $.ajax({
      type: "GET",
      url: "http://" + disqus_shortname + ".disqus.com/embed.js",
      dataType: "script",
      cache: true
    });

    // hide the button once comments load
    $(".article-comment__button").fadeOut();
  });

  // ===========================================================================
  //
  // carousel

  $(document).on("click", ".carousel-control", function(e) {
    e.preventDefault();
  });

  // ===========================================================================
  //
  // navigation

  $(document).on("click", ".page-intro__nav-dropdown-trigger", function(e) {
    e.preventDefault();
  });

  // ===========================================================================
  //
  // Fetch and display blog posts

  var blogRSSEndpoint = "https://open.dgraph.io/index.xml";
  $.get(blogRSSEndpoint, function(data) {
    // Pick 3 random blog posts to show
    var items = $(data).find("item");
    var itemsToDisplay = pickRandomItems(items, 3);

    itemsToDisplay.each(function(idx) {
      var item = $(this);
      var title = item.find("title").text();
      var link = item.find("link").text();
      var desc = excerpt(stripHTML(item.find("description").text()), 200);

      var $articleContainer = $(".blog-article-" + idx);
      $articleContainer.find(".title").text(title);
      $articleContainer.find(".desc").text(desc);
      $articleContainer.find(".link").attr("href", link);
    });

    // Display
    $(".blog-articles").removeClass("is-loading");
  });
}); // end document ready
