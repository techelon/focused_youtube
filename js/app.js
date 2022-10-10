(function() {
  document.body.style.display = "block";

  let currentUrl = window.location.href;

  let cleanUpFYClasses = () => {
    document.body.classList.forEach(className => {
      if(className.startsWith("fy-")) {
        document.body.classList.remove(className);
      }
    });
  }

  const initFY = () => {
    cleanUpFYClasses();

    if(window.location.pathname === "/" || window.location.pathname === "/feed/subscriptions" || location.pathname.indexOf("/shorts/") == 0) {
      initHomePage();
    } else if(window.location.pathname === "/results") {
      initResultsPage();
    } else if(window.location.pathname === "/watch") {
      initWatchPage();
    }
  }

  const initWatchPage = () => {
    document.body.classList.add("fy-watch-page");
  }

  const initResultsPage = () => {
    document.body.classList.add("fy-results-page");
  }

  const initHomePage = () => {
    const search = (event) => {
      event.preventDefault();

      const query = anchor.querySelector(".search-form__text-input").value;
      window.location.href = "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
    }

    document.body.classList.add("fy-home-page");

    const body = document.querySelector("body");
    const anchor = document.createElement("div");
    anchor.id = "mega-app";

    body.innerHTML = "";
    document.body.appendChild(anchor);

    anchor.innerHTML = `
      <div class="focused-youtube">
        <div class="focused-youtube__logo">
        </div>

        <div class="focused-youtube__body">
          <form class="focused-youtube__form search-form" action="#">
            <input class="search-form__text-input" type="text" placeholder="Search" />
            <button class="search-form__submit"></button>
          </form>
        </div>
      </div>
    `;

    anchor.querySelector(".search-form").onsubmit = search;
  }

  const observeDOM = (function() {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const eventListenerSupported = window.addEventListener;

    return function(obj, callback) {
      if(MutationObserver) {
        let obs = new MutationObserver(function(mutations, observer) {
          if(mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
            callback();
          }
        });

        obs.observe(obj, {
          childList: true,
          subtree: true
        });
      } else if(eventListenerSupported) {
        obj.addEventListener("DOMNodeInserted", callback, false);
        obj.addEventListener("DOMNodeRemoved", callback, false);
      }
    };
  })();

  initFY();

  observeDOM(document.body, function(){
    if(currentUrl !== window.location.href) {
      currentUrl = window.location.href;

      initFY();
    }
  });

  // https://gist.github.com/dgp/1b24bf2961521bd75d6c
  const catIds = {
      31: "Anime/Animation",
      40: "Sci-Fi/Fantasy",
      22: "People & Blogs",
      2: "Autos & Vehicles",
      30: "Movies",
      1: "Film & Animation",
      21: "Videoblogging",
      27: "Education",
      10: "Music",
      19: "Travel & Events",
      15: "Pets & Animals",
      39: "Horror",
      36: "Drama",
      32: "Action/Adventure",
      43: "Shows",
      17: "Sports",
      37: "Family",
      35: "Documentary",
      42: "Shorts",
      26: "Howto & Style",
      18: "Short Movies",
      24: "Entertainment",
      28: "Science & Technology",
      20: "Gaming",
      38: "Foreign",
      25: "News & Politics",
      23: "Comedy",
      29: "Nonprofits & Activism",
      41: "Thriller",
      44: "Trailers",
      34: "Comedy",
      33: "Classics"
    };

  function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return undefined;
  }

  function randomNumbers(count) {
    let a = "";
    for (let i=0; i<count; i++)
      a += Math.floor(Math.random() * 10);
    return a;
  }

  // Thank you https://stackoverflow.com/questions/24297929/javascript-to-listen-for-url-changes-in-youtube-html5-player for investigating YT events
  // This won't fire in embedded videos, which is probably best
  window.addEventListener('yt-page-data-updated', checkVidCat);
  async function checkVidCat() {
    // API key borrowed from https://crxcavator.io/source/jedeklblgiihonnldgldeagmbkhlblek/1.0.0?file=content.js&platform=Chrome
    const videoId = getQueryVariable("v");
    if (!videoId) return;
    // Contained within ytd-player, but there's only 1 video element & specifying causes video to be shown briefly so it's omitted
    const playerElem = document.querySelector("video");
    playerElem.style.opacity = "0";
    const videoMetadata = await (await fetch(`https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=AIzaSyCLtPIDnh66lUXv440RfC09ztaQekc2KxA`)).json();
    const videoCatId = Number.parseInt(videoMetadata.items[0].snippet.categoryId);
    const videoCat = catIds[videoCatId];
    // TODO: should I allow "science & tech"?
    if (videoCatId === 10) {
        // Do nothing b/c music videos are distracting, I'll never want to enable them, and the categorization is fairly accurate
    } else if (!([35, 27, 25, 28, 29, undefined]).includes(videoCatId)) {
      if (document.visibilityState === "hidden") return;
      // TODO: if I want to make it extra secure, I can shuffle the word order!
      // The random numbers are to prevent copy/paste
      const confirmationString = "I am sure I want to watch this video " + randomNumbers(6);
      document.querySelector(".ytp-play-button").click();  // Pause video

      const div = document.createElement("div");
      div.classList.add("focusyt-perfectCenter");
      div.innerText = confirmationString;
      document.body.appendChild(div);

      requestAnimationFrame(() => { requestAnimationFrame(() => {  // Call twice to ensure the div is displayed (requestAnimationFrame runs before redraw)
        const confirmation = prompt('Video category "' + videoCat + '" is not allowed. If you wish to continue, copy the onscreen popup') || "";
        if (confirmation.toLowerCase() === confirmationString.toLowerCase()) {
          playerElem.style.visibility = "100%";
        }
        div.remove();
        document.querySelector(".ytp-play-button").click();  // Play video. My attempt to abstract this failed
      })});
    } else {
      console.log(videoCat, "is allowed");
      playerElem.style.opacity = "100%";
    }
  }
})();
