import {
  SET_TWEETS,
  SET_KEYWORD,
  SET_TWEETLIST_LIMIT,
  SET_UNREAD_COUNT,
  ERASE_TWEETS,
} from "../constants/tweetConstants";
import axios from "axios";

export const setTweets = (data) => async (dispatch, getState) => {
  const { tweets, keyword, tweetListLimit } = getState().TweetData;
  if (tweets.length >= tweetListLimit) {
    const response = await axios.post(`/api/tweets/save/${keyword}`, {
      data: data,
    });
    dispatch({
      type: SET_UNREAD_COUNT,
      payload: response.data.tweetCounts,
    });
    return;
  }
  dispatch({
    type: SET_TWEETS,
    payload: data,
  });
};

export const setKeyword = (data) => async (dispatch, getState) => {
  dispatch({
    type: SET_KEYWORD,
    payload: data,
  });
};

export const setTweetListLimit = (data) => (dispatch) => {
  dispatch({
    type: SET_TWEETLIST_LIMIT,
    payload: data,
  });
};

export const loadMoreTweets = (data) => async (dispatch, getState) => {
  const { keyword, tweetListLimit } = getState().TweetData;
  const { data } = await axios.get(`/api/tweets/saved/${keyword}`);
  dispatch({
    type: SET_TWEETLIST_LIMIT,
    payload: tweetListLimit + 25, // TODO add this dynamic
  });

  dispatch({
    type: SET_TWEETS,
    payload: data.data,
  });

  dispatch({
    type: SET_UNREAD_COUNT,
    payload: data.tweetCounts,
  });
};

export const eraseTweets = (keyword) => async (dispatch) => {
  await axios.delete(`api/tweets/destroy`); // destroy stream first
  await axios.delete(`api/tweets/delete/tweets/${keyword}`);
  dispatch({
    type: ERASE_TWEETS,
  });
  dispatch({
    type: SET_UNREAD_COUNT,
    payload: 0,
  });
  dispatch({
    type: SET_TWEETLIST_LIMIT,
    payload: 25, // TODO add this dynamic
  });
  dispatch({
    type: SET_KEYWORD,
    payload: "",
  });
};
