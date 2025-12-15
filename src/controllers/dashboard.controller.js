import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    
      //  input + authorization (user exists or not)
    const channelId = req.user?._id

      //  validation 
    if(!channelId) {
        throw new ApiError(400, "Channel ID is required")
    }

    // Authorization: Check if the user is authorized to access the channel stats
    // (Here: only logged-in user can see their own channel stats)
    // already handled by auth middlewar




      // total videos fetched from database
     const totalVideos= await Video.countDocuments({
        owner: channelId
    })



       // total subscribers fetched from database
     const totalSubscribers= await Subscription.countDocuments({
        channel: channelId
    })

        // total views fetched from database   
    const  totalViews= await Video.aggregate([
          

        // agregation pipeline stages
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
        
    ])


      // total likes fetched from database
     const VideoIds=await Video.find({owner:channelId}).select("_id")
     const totalLikes= await Like.countDocuments({
        video: { $in: VideoIds }
    })

          // send response
    res.staus(200)
    .json(  
        new ApiResponse(200,
             "Channel stats fetched successfully", 
             {  totalVideos,
                totalSubscribers,
               totalViews,
               totalLikes
            
            }  )
    )

})





const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

     

    const channelId = req.user?._id

    //  validation 
    if(!channelId) {
        throw new ApiError(400, "Channel ID is required")
    }

    // Authorization: Check if the user is authorized to access the channel videos
    // (Here: only logged-in user can see their own channel videos)
    // already handled by auth middleware

    const videos = await Video.find({ owner: channelId })

    // send response
    res.status(200)
    .json(
        new ApiResponse(200,
             "Channel videos fetched successfully", 
             videos
            )
    )


})

export {

    getChannelStats, 
    getChannelVideos,


}


