(function() {
  document.body.style.display = "block";

  let currentUrl = window.location.href;
  
  // API key borrowed from https://crxcavator.io/source/jedeklblgiihonnldgldeagmbkhlblek/1.0.0?file=content.js&platform=Chrome
  const apiKey = "AIzaSyCLtPIDnh66lUXv440RfC09ztaQekc2KxA";

  let cleanUpFYClasses = () => {
    document.body.classList.forEach(className => {
      if(className.startsWith("fy-")) {
        document.body.classList.remove(className);
      }
    });
  }

  const initFY = () => {
    cleanUpFYClasses();

    if(!location.pathname.startsWith("/feed") && location.pathname !== "/playlist" && !location.pathname.startsWith("/embed")
        && !location.pathname.startsWith("/howyoutubeworks") && !location.pathname.startsWith("/copyright_complaint_form")
        && !location.pathname.startsWith("/@")) {
      if(location.pathname === "/watch" || location.pathname.startsWith("/live")) {
        initWatchPage();
      } else if (location.pathname.startsWith("/shorts"))
        location.replace(location.href.replace("shorts/", "watch?v="));
      else {
        initHomePage();
      }
    } else if (location.pathname === "/feed/subscriptions") {
      setTimeout(initSubscriptions, 2000);
    }
  }

  const initWatchPage = () => {
    document.body.classList.add("fy-watch-page");
  }

  const initResultsPage = () => {
    document.body.classList.add("fy-results-page");
  }
  
  function initSubscriptions() {
    const removeCDATA = str => str.replace("<![CDATA[", "").replace("]]>", "");
    
    const now = new Date().getTime();
    const container = document.createElement("div");
    container.classList.add("playlist-container");
    document.querySelector("ytd-shelf-renderer").prepend(container);
    // YT stores its key in `ytcfg.get("WEB_PLAYER_CONTEXT_CONFIGS")["WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH"]["innertubeApiKey"]`
    const playlists = [
      "PL-uopgYBi65HwiiDR9Y23lomAkGr9mm-S",  // Helluva boss
      "PLNYkxOF6rcIDfz8XEA3loxY32tYh7CI3m",  // What's new in Chrome
      "PLNYkxOF6rcIBDSojZWBv4QJNoT4GNYzQD",  // What's new in DevTools
      "PLFt_AvWsXl0ehjAfLFsp1PGaatzAwo0uK",  // Sebastian Lague Coding Adventures
      "PLFt_AvWsXl0dPhqVsKt1Ni_46ARyiCGSq",  // Sebastian Lague how computers work
      "PLnKtcw5mIGUTCUGoIUhN28LdPxT879z8E",  // Pixel updates
      "PLtY71Sv1CZtCu1bT5nkU2laNl5USA-y0i",  // My school spirit
      "PL0vfts4VzfNjnYhJMfTulea5McZbQLM7G",  // The code report
      "PL0vfts4VzfNiI1BsIK5u7LpPaIDKMJIDN",  // Fireship 100 seconds
      "PLHovnlOusNLgvAbnxluXCVB3KLj8e4QB-",  // Digital Circus
    ];
    for (const playlist of playlists) {
      fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlist}&key=${apiKey}`)
        .then(response => response.json())
        .then(({items}) => {
          for (const {snippet} of items) {
            const data = {
              thumbnail: snippet.thumbnails.high.url,
              publish: new Date(snippet.publishedAt).getTime(),
              link: "https://www.youtube.com/watch?v=" + snippet.resourceId.videoId,
              title: snippet.title,
              // Unused properties
              description: snippet.description,
              channel: snippet.channelTitle,
              //TODO: view count
            };
            if (data.publish < now - 6.048e+8) continue;  // Stop adding if older than a week. Use `continue` instead of `break` b/c if len(playlists) < 5, it seems videos are arranged chronologically ascending instead of descending, so knowing that the first video is too old will provide no useful information about the 2nd
            container.appendChild(createVideoRenderer(data));
          }
        });
    }
  }
  
  function createVideoRenderer({thumbnail, link, title}) {
    const container = document.createElement("div");
    container.classList.add("video-renderer");
    
    const img = document.createElement("img");
    img.src = thumbnail;
    img.classList.add("thumbnail");
    container.appendChild(img);
    
    const titleDiv = document.createElement("div");
    titleDiv.innerText = title;
    titleDiv.classList.add("title-div");
    container.appendChild(titleDiv);
    
    const a = document.createElement("a");
    a.href = link;
    a.appendChild(container);
    return a;
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
    } else if (window.location.pathname === "/results") {  // Disallow ctrl-clicking on results page
      for (const anchor of document.getElementsByTagName("a"))
        anchor.onclick = ev => ev.preventDefault();
    }
  });

  // https://gist.github.com/dgp/1b24bf2961521bd75d6c
  const catIds = {
      "-1": "Unknown",
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
    const allowedOverrides = new Set(["school", "education", "tutorial", "news", "short"]);

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

  async function getVideoElem() {
    const maxRetry = 8;  // 4 seconds
    for (let retry = 0; retry < maxRetry; retry++) {
      const playerElem = document.querySelector("video");
      if (playerElem) return playerElem;
      await new Promise(res => window.setTimeout(res, 500));
    }
    document.documentElement.innerHTML = "Failed to block video after 4 seconds, reload the page";
  }

  // Thank you https://stackoverflow.com/questions/24297929/javascript-to-listen-for-url-changes-in-youtube-html5-player for investigating YT events
  // This won't fire in embedded videos, which is probably best
  window.addEventListener('yt-page-data-updated', checkVidCat);
  async function checkVidCat() {
    const videoId = getQueryVariable("v");
    if (!videoId) return;
    // Contained within ytd-player, but there's only 1 video element & specifying causes video to be shown briefly so it's omitted
    const playerElem = await getVideoElem();
    playerElem.style.opacity = "0";
    const videoMetadata = await (await fetch(`https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`)).json();
    // Optional chaining in case rate limit exceeded
    const videoCatId = Number.parseInt(videoMetadata.items?.[0]?.snippet?.categoryId ?? "-1");
    const videoCat = catIds[videoCatId];
    if (!([35, 27, 25, 28, 29]).includes(videoCatId)) {
      if (document.visibilityState === "hidden") return;
      // Not in allowed category, ask for manual confirmation
      document.querySelector(".ytp-play-button").click();  // Pause video
      const categoryOrActivity = prompt('Video category "' + videoCat + '" is not allowed. If wrong, enter the correct allowed category ('
                                        + Array.from(allowedOverrides).join(", ") + "). Otherwise, type something else you could be doing now.");

      if (categoryOrActivity) {
        if (allowedOverrides.has(categoryOrActivity)) {
          playerElem.style.opacity = "100%";
        } else {
          const reason = prompt(`Why should you be allowed to watch this instead of doing ${categoryOrActivity}?`);

          if (reason) {
            playerElem.style.opacity = "100%";
          }
        }
      }

      document.querySelector(".ytp-play-button").click();  // Play video. My attempt to abstract this failed
    } else {
      console.log(videoCat, "is allowed");
      playerElem.style.opacity = "100%";
    }
  }
})();
