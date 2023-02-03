import React, { useState, useEffect } from "react";

const ListeningStory = () => {
  const YOUTUBE_ID_PARSER =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

  const parseYouTubeVideoID = (url) => {
    const urlMatches = url.match(YOUTUBE_ID_PARSER);

    return urlMatches?.[2].length === 11 ? urlMatches[2] : null;
  };

  // const [youtubeUrl, setYoutubeUrl] = useState("");
  // const videoID = parseYouTubeVideoID(youtubeUrl);

  const videoID = "cbAj3biUeDI";

  // https://developers.google.com/youtube/iframe_api_reference

  // const [spaceBtnClicked, setSpaceBtnClick] = useState(false);
  const [player, setPlayer] = useState();

  useEffect(() => {
    // document.addEventListener("keyup", function (e) {
    //   if (e.code === "Space") {
    //     debugger;
    //     setSpaceBtnClick((prevState) => ({
    //       ...prevState,
    //       spaceBtnClicked: !prevState,
    //     }));
    //   }
    // });

    if (!window.YT) {
      // If not, load the script asynchronously
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";

      // onYouTubeIframeAPIReady will load the video after the script is loaded
      window.onYouTubeIframeAPIReady = loadVideo;

      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      // If script is already there, load the video directly
      loadVideo();
    }
  }, []);

  const [showControls, setShowControls] = useState(0);

  const loadVideo = () => {
    // the Player object is created uniquely based on the id in props
    const player = new window.YT.Player(`youtube-player-${videoID}`, {
      videoId: videoID,
      height: "234",
      width: "432",
      playerVars: {
        // autoplay: 1
        rel: 0,
        controls: 0,
        modestbranding: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });

    setPlayer(player);
  };

  const onPlayerReady = (event) => {
    event.target.setVolume(100);
    // event.target.playVideo();
    // event.target.setPlaybackQuality("hd1080");  "highres"

    // if (spaceBtnClicked) console.log(event); // want to stop the video if space bar clicked
  };

  const onPlayerStateChange = (e) => {
    // if (spaceBtnClicked) onPause();
    // else onPlay();

    console.log(e.target);
  };

  const [timer, setTimer] = useState(0);

  // another option without event https://stackoverflow.com/a/28752256
  useEffect(() => {
    window.addEventListener("message", onMessage);

    return () => window.removeEventListener("click", onMessage);
  }, [player]);

  // https://stackoverflow.com/a/65511524
  const onMessage = (event) => {
    // Check that the event was sent from the YouTube IFrame.
    if (player)
      if (event.source === player.getIframe().contentWindow) {
        var data = JSON.parse(event.data);

        // The "infoDelivery" event is used by YT to transmit any kind of information change in the player,
        // such as the current time or a playback quality change.
        if (
          data.event === "infoDelivery" &&
          data.info &&
          data.info.currentTime
        ) {
          // currentTime is emitted very frequently (milliseconds), but we only care about whole second changes.
          const time = Math.floor(data.info.currentTime);
          setTimer(time);
        }
      }
  };

  const [quesList, setQuesList] = useState([
    {
      type: "fill",
      time: 2,
      question: [
        { type: "text", text: "" },
        {
          type: "gap",
          gap: "",
          correct: [{ reason: "", answer: "" }],
        },
        { type: "text", text: "" },
      ],
    },
    5,
    8,
  ]);
  useEffect(() => {
    if (quesList.findIndex((ques) => ques === timer) > -1) {
      console.log("trigger time", timer);
    }
  }, [timer]);

  const onPause = () => {
    player.pauseVideo();

    console.log(Math.floor(player.getCurrentTime()));
  };

  const onSeek = () => {
    player.seekTo(player.getDuration() / 2, true);
  };

  const onStop = () => {
    player.stopVideo();
  };

  const onPlay = () => {
    player.playVideo();

    // const nextTime = quesList[nextQues.index];
    // const currentTime = Math.floor(player.getCurrentTime());

    // if (nextTime > currentTime) {
    //   setNextQues({
    //     ...nextQues,
    //     timer: nextTime - currentTime,
    //     running: true,
    //   });
    // }
  };

  // const [nextQues, setNextQues] = useState({
  //   show: false,
  //   running: false,
  //   index: 0,
  //   timer: quesList[0],
  // });

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (nextQues.running === true) {
  //       if (player) player.pauseVideo();

  //       const nextIndex = nextQues.index + 1;
  //       if (nextIndex === quesList.length) {
  //         console.log("Stoppp");
  //       } else {
  //         setNextQues({
  //           ...nextQues,
  //           show: true,
  //           running: false,
  //           index: nextIndex,
  //         });
  //         console.log("Show ques with index", nextQues.index);
  //       }
  //     }
  //   }, nextQues.timer * 1000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [nextQues]);

  // pointer-events: none; for wrapper
  return (
    <div>
      ListeningStory
      <div>{timer}</div>
      <button onClick={() => onPlay()}>Play</button>
      <button onClick={() => onSeek()}>Seek</button>
      <button onClick={() => onPause()}>Pause</button>
      <button onClick={() => onStop()}>Stop</button>
      <div id={`youtube-player-${videoID}`}></div>
    </div>
  );
};

export default ListeningStory;
