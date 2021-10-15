const express = require("express");
const mongoose = require("mongoose");
const boom = require("boom");
const router = express.Router();
const {
  getRules,
  setRules,
  deleteRules,
  streamTweets,
} = require("../services/twitter_services");
//Setting models

const Schema = mongoose.Schema;
const tweetSchema = new Schema({}, { strict: false });
const Tweet = mongoose.model("Tweet", tweetSchema);

let stream; // TDOO : check this

router.get("/search/:keyword", async (req, res, next) => {
  try {
    const keyword = req.params.keyword;
    let currentRules;
    // Get all stream rules
    currentRules = await getRules();
    // Delete all stream rules
    await deleteRules(currentRules);
    // Set rules based on array above
    await setRules([{ value: keyword }]);
    stream = streamTweets(global.io); // assiged to destroy stream later
    res.status(201).send();
  } catch (err) {
    return next(boom.boomify(err));
  }
});

router.get("/saved/:keyword", async (req, res, next) => {
  try {
    const keyword = req.params.keyword;
    // Subscriber.find({ user_id: { $in: superUsers.map(i => i._id) } });
    const data = await Tweet.find({ keyword: keyword }).limit(25).exec();
    const dataTodelete = data.map((i) => i._id);
    await Tweet.deleteMany({ _id: { $in: dataTodelete } });
    const tweetCounts = await Tweet.find({ keyword: keyword }).countDocuments();
    res.json({ data, tweetCounts });
  } catch (err) {
    return next(boom.boomify(err));
  }
});

router.post("/save/:keyword", async (req, res, next) => {
  try {
    const keyword = req.params.keyword;
    const data = req.body.data;
    const filter = { id: data.data.id };
    const update = { ...data, keyword };
    await Tweet.findOneAndUpdate(filter, update, {
      upsert: true,
    });
    const tweetCounts = await Tweet.find({ keyword: keyword }).countDocuments();
    res.json({ tweetCounts });
  } catch (err) {
    return next(boom.boomify(err));
  }
});

router.delete("/delete/tweets/:keyword", async (req, res, next) => {
  try {
    const keyword = req.params.keyword;
    await Tweet.deleteMany({ keyword: keyword });
    res.status(201).send();
  } catch (err) {
    return next(boom.boomify(err));
  }
});

router.delete("/destroy", async (req, res, next) => {
  try {
    if (stream) {
      stream.destroy();
    }
    res.status(201).send();
  } catch (err) {
    return next(boom.boomify(err));
  }
});

module.exports = router;
