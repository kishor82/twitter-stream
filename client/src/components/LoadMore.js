import React from "react";
import { useDispatch } from "react-redux";
import { loadMoreTweets } from "../actions/tweetActions";
import "./LoadMore.css";

const LoadMore = () => {
  const dispatch = useDispatch();

  const handleLoadMore = () => {
    // load data heredisp
    dispatch(loadMoreTweets());
  };
  return (
    <div>
      <button id="loadMore" onClick={handleLoadMore}>
        Load More
      </button>
    </div>
  );
};

export default LoadMore;
