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

    if(window.location.pathname === "/" || window.location.pathname === "/feed/subscriptions") {
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
    // Kinda scuffed but I have to do it this way
    const search = document.querySelector('input#search');
    search.onchange = () => setTimeout(() => { search.value = ""; search.placeholder = "READ A BOOK!"; }, 200);
    search.onchange();
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
            <input class="search-form__text-input" type="text" placeholder="READ A BOOK!" />
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

  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('js/content-script.js');
  (document.head||document.documentElement).appendChild(s);
  // s.onload = function() {
  //   s.remove();
  // };

  // Hides video if not educational
  
  // Category is exposed in this var, but CSP prohibits access, so don't do this
  //console.log("FOCUS", ytInitialPlayerResponse.microformat.playerMicroformatRenderer.category);
  // Grr seems like I need OAuth even though I'm not accessing any user info?
  /*
  await fetch("https://youtube.googleapis.com/youtube/v3/videos?id=IKQjHwVc8b0&part=snippet&key=TODO", {
    method: "GET",
    headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer TODO'},
  }).then(res => 
    res.json()
  );
  
  function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    gapi.client.setApiKey("YOUR_API_KEY");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute() {
    return gapi.client.youtube.videos.list({
      "part": [
        "snippet"
      ],
      "id": [
        "Ks-_Mh1QhMc"
      ]
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "YOUR_CLIENT_ID"});
  });
  
  const scriptTag = document.createElement('script');
  scriptTag.integrity = "sha256-ecqpMHAuDOFcxft/3NarC3Cf9hQH64zA7fSBi0KAO3o=";
  const scriptBody = document.createTextNode("alert('hacked!')");
  scriptTag.appendChild(scriptBody);
  document.body.append(scriptTag);
  //.video-stream, .html5-main-video {
    /* TODO: use Google API to selectively apply to non-educational videos
       Fist make a request to https://developers.google.com/youtube/v3/docs/videos/list body: {part: "snippet", id: "<video_id>"}
       Then, pass response.categoryId to https://developers.google.com/youtube/v3/docs/videoCategories/list body: {part: "snippet" id: response.id} 
       Also see https://crxcavator.io/source/jedeklblgiihonnldgldeagmbkhlblek/1.0.0?file=content.js&platform=Chrome for examples
       Example:
       { "snippet": {
        "title": "Education",
        "assignable": true,
        "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
       }}*/
    /* https://gist.github.com/dgp/1b24bf2961521bd75d6c
    {
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
      }*/
    //display: none !important;
})();
