import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
     const { content } = req.body
    const userId = req.user._id

    // validation
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Tweet content is required")
    }

    // create tweet
    const tweet = await Tweet.create({
        content,
        owner: userId
    })

    return res
        .status(201)
        .json(new ApiResponse(201, tweet, "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
     const { userId } = req.params

    // validation
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    // check user exists
    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // fetch tweets
    const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "User tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
     const { tweetId } = req.params
    const { content } = req.body
    const userId = req.user._id

    // validation
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Tweet content is required")
    }

    // find tweet
    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    // authorization
    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to update this tweet")
    }

    // update
    tweet.content = content
    await tweet.save()

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params
    const userId = req.user._id

    // validation
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    // find tweet
    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    // authorization
    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to delete this tweet")
    }

    // delete
    await tweet.deleteOne()

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}