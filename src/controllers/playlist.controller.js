import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const userId = req.user.id

    if(!name){
        throw new ApiError(400, "Playlist name is required")
    }

    const newPlaylist = await Playlist.create({
        name,
        description,
        owner: userId
    })

    res.status(201).json(
        new ApiResponse(
            201,
            "Playlist created successfully",
            newPlaylist
        )
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user ID")
    }

    const playlists = await Playlist.find({owner: userId})

    res.status(200).json(
        new ApiResponse(
            200,
            "User playlists fetched successfully",
            playlists
        )
    )

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    res.status(200).json(
        new ApiResponse(
            200,
            "Playlist fetched successfully",
            playlist
        )
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params 
    const userId = req.user.id

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid playlist ID or video ID")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    if(playlist.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You are not authorized to modify this playlist")
    }

    // check if video already exists in playlist
    if(playlist.videos.includes(videoId)){
        throw new ApiError(400, "Video already exists in the playlist")
    }

    playlist.videos.push(videoId)
    await playlist.save()
    res.status(200).json(
        new ApiResponse(
            200,
            "Video added to playlist successfully",
            playlist
        )
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
   const { playlistId, videoId } = req.params
    const userId = req.user._id

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist")
    }

    playlist.videos = playlist.videos.filter(
        (vid) => vid.toString() !== videoId
    )

    await playlist.save()

    return res.status(200).json(
        new ApiResponse(200, "Video removed from playlist", playlist)
    )
    

})

const deletePlaylist = asyncHandler(async (req, res) => {
   const { playlistId } = req.params
    const userId = req.user._id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to delete this playlist")
    }

    await playlist.deleteOne()

    return res.status(200).json(
        new ApiResponse(200, "Playlist deleted successfully")
    )
  


})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    const userId = req.user._id
   if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to update this playlist")
    }

    if (name) playlist.name = name
    if (description) playlist.description = description

    await playlist.save()

    return res.status(200).json(
        new ApiResponse(200, "Playlist updated successfully", playlist)
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}