import React, { useState } from "react";
import Notification from "./Notification";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setKeyword, eraseTweets } from "../actions/tweetActions";
import Loader from "../components/Loader";
import "./SearchBar.css";

const SearchBar = () => {
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { keyword } = useSelector((state) => state.TweetData);
  const dispatch = useDispatch();

  const handleOnchange = (e) => {
    if (!e.target.value) {
      dispatch(eraseTweets(keyword));
    }
    setCurrentKeyword(e.target.value);
  };

  const handleSubmit = async () => {
    if (keyword && currentKeyword !== keyword) {
      dispatch(eraseTweets(keyword));
    }
    if (!currentKeyword) {
      return;
    }
    try {
      setIsLoading(true);
      await axios.get(`/api/tweets/search/${currentKeyword}`);
      dispatch(setKeyword(currentKeyword));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="main">
      <div className="searchbox js-searchbox">
        <div className="searchbox-icon js-searchbox-icon">
          <i className="fas fa-search"></i>
        </div>
        <div className="searchbox-input">
          <input
            type="text"
            name="keyword"
            className="input js-input"
            id="searchInput js-searchInput"
            placeholder="Search Twitter"
            onChange={handleOnchange}
            value={currentKeyword}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button
          className={`button left_radius ${
            !currentKeyword.length ? "disabled" : ""
          }`}
          onClick={handleSubmit}
          disabled={!currentKeyword.length}
        >
          {isLoading ? <Loader /> : "Search"}
        </button>
      </div>
      <Notification />
    </div>
  );
};

export default SearchBar;
