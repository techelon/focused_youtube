// Must be anonymous to prevent global namespacing because YT is a PWA and vars will collide between "page loads"
(function() {
    // https://gist.github.com/dgp/1b24bf2961521bd75d6c
    const catIds = {
        "Film & Animation": 1,
        "Autos & Vehicles": 2,
        "Music": 10,
        "Pets & Animals": 15,
        "Sports": 17,
        "Short Movies": 18,
        "Travel & Events": 19,
        "Gaming": 20,
        "Videoblogging": 21,
        "People & Blogs": 22,
        "Comedy": 34,
        "Entertainment": 24,
        "News & Politics": 25,
        "Howto & Style": 26,
        "Education": 27,
        "Science & Technology": 28,
        "Nonprofits & Activism": 29,
        "Movies": 30,
        "Anime/Animation": 31,
        "Action/Adventure": 32,
        "Classics": 33,
        "Documentary": 35,
        "Drama": 36,
        "Family": 37,
        "Foreign": 38,
        "Horror": 39,
        "Sci-Fi/Fantasy": 40,
        "Thriller": 41,
        "Shorts": 42,
        "Shows": 43,
        "Trailers": 44
    }

    const videoCat = window?.ytInitialPlayerResponse?.microformat?.playerMicroformatRenderer?.category || "n/a";
    const confirmationString = "I am sure I want to watch this video";
    if (!([35, 27, 25, 10, undefined]).includes(catIds[videoCat])) {
        const confirmation = prompt('Video category "' + videoCat + '" is not allowed. If you wish to continue, enter "' + confirmationString + '"') || "";
        if (confirmation.toLowerCase() !== confirmationString.toLowerCase())
            history.back();
    } else
        console.log(videoCat, "is allowed");
})();