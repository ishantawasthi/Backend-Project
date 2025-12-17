import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const subscriberId = req.user._id

    // 1 validate channelId
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    // 2 prevent self-subscription
    if (channelId.toString() === subscriberId.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel")
    }

    // 3 check channel exists
    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    // 4 check existing subscription
    const existingSubscription = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    })

    // 5 toggle logic
    if (existingSubscription) {
        await existingSubscription.deleteOne()

        return res.status(200).json(
            new ApiResponse(200, "Unsubscribed successfully")
        )
    }

    // 6 create subscription
    await Subscription.create({
        subscriber: subscriberId,
        channel: channelId
    })

    return res.status(201).json(
        new ApiResponse(201, "Subscribed successfully")
    )

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
 const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username avatar")

    return res.status(200).json(
        new ApiResponse(200, "Subscribers fetched successfully", subscribers)
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id")
    }

    const channels = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "username avatar")

    return res.status(200).json(
        new ApiResponse(200, "Subscribed channels fetched successfully", channels)
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}