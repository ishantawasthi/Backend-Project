import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video


    // videoId comes from URL  --> /videos/:videoId/comments
    const {videoId} = req.params


    // pagination 
    const {page = 1, limit = 10} = req.query

     // validate videoId (MongoDB ObjectId)
     if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Invalid video ID")
     }
    
     // fetch comments from DB (related to video)

      const comments= await Comment.find({videoId})
      .skip((page -1)*limit)  // pagination logic
      limit(Number(limit))  // limit number of comments
      .sort({createdAt: -1}) // sort by latest first

    // send response
    res.status(200).json( 
        new ApiResponse(200, 
        "Comments fetched successfully", comments)   )

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const {videoId}=req.params
    const {text}=req.body

    // validate videoId (MongoDB ObjectId)
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Invalid video ID")
     }

    // create comment in DB

    const comment =await Comment.create({
        videoId,
        text,
        userId:req.user._id  //   comes from auth middleware
    })

    // send response
    res.status(201).json(
        new ApiResponse(201, 
        "Comment added successfully", comment)
    )  

})


const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const {commentId}=req.params
    const {text}=req.body

    // validate commentId (MongoDB ObjectId)
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "Invalid comment ID")
     }

    // find comment in DB
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404, "Comment not found")
    }
    // check if the logged-in user is the owner of the comment
    if(comment.userId.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to update this comment")
    }

    // update comment text
    comment.text = text
    await comment.save()

    // send response
    res.status(200).json(
        new ApiResponse(200, 
        "Comment updated successfully", comment)
    )



})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment


     const {commentId}=req.params

    // validate commentId (MongoDB ObjectId)
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "Invalid comment ID")
     }

    // find comment in DB
    const comment = await Comment.findById(commentId)
     if(!comment){
        throw new ApiError(404, "Comment not found")
   
    }
    
    // check if the logged-in user is the owner of the comment
    if(comment.userId.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this comment")
    }

    // delete comment
    await comment.remove()


    // send response
    res.status(200).json(
        new ApiResponse(200, {},
        "Comment deleted successfully",)
    )

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }