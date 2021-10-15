const { appendQueryParameter } = require("../utils");
const { rulesURL, streamURL } = require("../constants");
const needle = require("needle");
const keys = require("../config/keys");
const TOKEN = keys.TWITTER_BEARER_TOKEN;

const filter = {
  "tweet.fields": ["public_metrics"],
  expansions: ["author_id"],
  "user.fields": ["profile_image_url", "verified,created_at"],
};

let stream_uri = streamURL;
if (filter) {
  // if filter value is present,update query paramters with filter values.
  Object.keys(filter).map((key) => {
    stream_uri = appendQueryParameter(stream_uri, key, filter[key]);
  });
}

const getRules = async () => {
  const response = await needle("get", rulesURL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.body;
};

// Set stream rules
const setRules = async (rules) => {
  const data = {
    add: rules,
  };
  const response = await needle("post", rulesURL, data, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.body;
};

// Delete stream rules
const deleteRules = async (rules) => {
  if (!Array.isArray(rules.data)) {
    return null;
  }
  const ids = rules.data.map((rule) => rule.id);
  const data = {
    delete: {
      ids,
    },
  };
  const response = await needle("post", rulesURL, data, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.body;
};

const streamTweets = (socket) => {
  const stream = needle.get(stream_uri, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  stream.on("data", async (data) => {
    try {
      if (data) {
        const json = JSON.parse(data);
        socket.emit("tweet", json);
      }
    } catch (error) {
      // console.log(error);
    }
  });
  return stream;
};

module.exports = {
  getRules,
  setRules,
  deleteRules,
  streamTweets,
};
