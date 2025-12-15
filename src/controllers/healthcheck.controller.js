import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


// Healthcheck controller to verify if the server is running or not

const healthcheck = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, "OK", { status: "Service is healthy" })
    )
})

export {
    healthcheck
}
