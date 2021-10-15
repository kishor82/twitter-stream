import {
  SET_TWEETS,
  SET_KEYWORD,
  SET_TWEETLIST_LIMIT,
  SET_UNREAD_COUNT,
  ERASE_TWEETS,
} from "../constants/tweetConstants";
import { uniqBy } from "lodash";
const initialState = {
  tweets: [],
  keyword: "",
  tweetListLimit: 25,
  unreadCount: 0,
};
export const tweetReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TWEETS:
      return {
        ...state,
        tweets: uniqBy(
          [
            ...state.tweets,
            ...(Array.isArray(action.payload)
              ? action.payload
              : [action.payload]),
          ],
          "data.id"
        ),
      };
    case ERASE_TWEETS:
      return {
        ...state,
        tweets: [],
      };
    case SET_KEYWORD:
      return {
        ...state,
        keyword: action.payload,
      };
    case SET_TWEETLIST_LIMIT:
      return {
        ...state,
        tweetListLimit: action.payload,
      };
    case SET_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload,
      };
    default:
      return state;
  }
};
