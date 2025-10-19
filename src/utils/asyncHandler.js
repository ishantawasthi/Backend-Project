
  // type 1  by Promise 


const asyncHandler=(requestHandler)=>{
     (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next))
        .catch((err) => next(err))   // Promise reject
     }
}



  //    type - 2 by  try catch


// const asyncHandler=()=>{}
// const asyncHandler=(fn)=>()=>{}
// const asyncHandler=(fn)=>async()=>{}

    // const asyncHandler= (fn) => async(req,res,next) => {
    //     try{
    //         await fn(req,res,next)

    //     }catch(error){
    //         console.log(error.code || 500).json({
            
    //               success:true,
    //               message:error.message

    //         })
    //     }
    // }


export  {asyncHandler}