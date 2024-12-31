# Focused Youtube <a href="https://chrome.google.com/webstore/detail/focused-youtube/nfghbmabdoakhobmimnjkamfdnpfammn"><img width="124" alt="Add to Chrome" src="https://user-images.githubusercontent.com/768070/113516074-a1513500-9578-11eb-9eb9-06326003cf66.png"></a>

Thank you to [makaroni4/focused_youtube](https://github.com/makaroni4/focused_youtube) for the base extension!

:mag: **Focused Youtube** (FY) is a Chrome Extension that helps you stay focused by blocking recommendations and other elements on Youtube.

:heart: FY **does not track any user data**. It's a simple Vanilla JS application made with only one purpose – to help you avoid Youtube's rabbit hole.

:sparkles: **Changes from upstream:** [category enforcement](#-category-enforcement), [subscribe to playlists](https://github.com/funblaster22/focused_youtube/blob/8fa787c7c94dd1d8b2cf0d2e1cb957ccb4ed0f69/js/app.js#L45), desaturate thumbnails, re-enable comments, disable channel page & shorts, [always keep enabled](https://github.com/funblaster22/focused_youtube/tree/showhide/watchdog-ext)

## Screenshots

### 🏠 Distraction-free Youtube homepage.

<img width="800" alt="home_page" src="https://user-images.githubusercontent.com/768070/134961830-40a6ec9d-9593-4447-b3d7-fa02462d6a19.png">

### 🔍 Searching disabled

### 📺 Noise-free video page.

<img width="800" alt="video_page" src="https://user-images.githubusercontent.com/768070/134961989-6673499b-311f-4334-825b-815b66446fd1.png">

Only shows the top two comments

### 🙅 Category enforcement
Disallow watching videos from [hard-coded categories](https://github.com/funblaster22/focused_youtube/blob/15f80de9e16cdfff07981c9fcb48db18a1a84940/js/app.js#L237). If the video was misclassified, you can type in the correct category. This frequently changes.

<img width="800" alt="video_page" src="https://user-images.githubusercontent.com/53224922/205467755-a83d01f9-d64c-437f-b4c5-55e8e4b4ebab.png">

## Development

Clone FY's repo to your computer.

Load the repo to [chrome://extensions/](chrome://extensions/) via "Load unpacked":

<img width="611" alt="update_extension" src="https://user-images.githubusercontent.com/768070/134963200-aaf3241a-522a-4079-a416-a1b58811a97c.png">

:mag: You'll need to update extension :point_up: every time you changed CSS/JS files.
