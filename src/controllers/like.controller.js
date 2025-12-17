import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {

       //TODO: toggle like on video

    const {videoId} = req.params
    const userId=req.user._id
  
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }

     // check if like already exists
    const existingLike = await Like.findOne({
        likedBy: userId,
         video: videoId
    })


    // toggle logic 
    if(existingLike){
        // if like exists, remove it (unlike)
        await existingLike.remove()
        return res.status(200).json(new ApiResponse(true, "Video unliked successfully"))
    }


    // if like does not exist, create it (like)
    const newLike = await Like.create({
        likedBy: userId,
        video: videoId
    })


    res.status(201).json(
        new ApiResponse(
            201, 
           "Video liked successfully", 
            newLike
        ))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    const userId=req.user._id

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment id")
    }

        // check if like already exists

    const existingLike = await Like.findOne({
        likedBy: userId,
         comment: commentId
    })

    // toggle logic
    if(existingLike){
        // if like exists, remove it (unlike)
        await existingLike.remove()
        return res.status(200).json(new ApiResponse(true, "Comment unliked successfully"))
    }

    // if like does not exist, create it (like)
    const newLike = await Like.create({
        likedBy: userId,
        comment: commentId
    })

    res.status(201).json(
        new ApiResponse(
            201, 
           "Comment liked successfully", 
            newLike
        ) )



})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

     const userId=req.user._id

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id")
    }

        // check if like already exists

    const existingLike = await Like.findOne({
        likedBy: userId,
         tweet: tweetId
    })

    // toggle logic
    if(existingLike){
        // if like exists, remove it (unlike)
        await existingLike.remove()
        return res.status(200).json(new ApiResponse(true, "Tweet unliked successfully"))
    }

    // if like does not exist, create it (like)
    const newLike = await Like.create({
        likedBy: userId,
        tweet: tweetId
    })


    res.status(201).json(
        new ApiResponse(
            201, 
           "Tweet liked successfully", 
            newLike
        ) )

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const userId=req.user._id

    const likedVideos = await Like.find({
        likedBy: userId,
        video: {$exists: true} // only videos
    }).populate('video') // populate video details

    res.status(200).json(
        new ApiResponse(
            200, 
           "Liked videos fetched successfully", 
            likedVideos // return only video details
        ) )

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}