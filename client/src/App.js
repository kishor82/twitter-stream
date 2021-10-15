import { useEffect } from "react";
import openSocket from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { setTweets } from "./actions/tweetActions";
import TweeterCard from "./components/TweeterCard";
import SearchBar from "./components/SearchBar";
import LoadMore from "./components/LoadMore";

const socket = openSocket({
  transports: ["websocket"],
});

// const socket = openSocket("localhost:7781", { // for development
//   transports: ["websocket"],
// });

const subscribeToStream = (cb) => {
  socket.on("connect", () => console.log("Connected..."));
  socket.on("tweet", cb);
};

function App() {
  const { tweets, tweetListLimit, keyword } = useSelector(
    (state) => state.TweetData
  );
  const dispatch = useDispatch();

  const saveTweets = (tweet) => {
    dispatch(setTweets(tweet));
  };

  useEffect(() => {
    subscribeToStream(saveTweets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <div className="HeaderBar">
        <SearchBar />
      </div>
      {keyword && <div className="info">Stream rule : {keyword}</div>}
      {tweets.map((item, i) => (
        <TweeterCard key={item.data.id} tweet={item} />
      ))}
      {tweets.length === tweetListLimit && <LoadMore />}
    </div>
  );
}

export default App;
