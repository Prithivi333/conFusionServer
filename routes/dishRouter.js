const express=require('express');
const bp=require('body-parser');

const dishRouter=express.Router({ mergeParams: true });

dishRouter.use(bp.json());

dishRouter.route('/')
.all((req,res,next)=>{   
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();   //next() calls other get or put or any other requests
})
.get((req,res,next)=>{
    res.end('Will send all dishes soon!');
})
.post((req,res,next)=>{
    res.end('Will add the dish: '+req.body.name+' with details: '+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next)=>{
    res.end('Deleting all the dishes');
});

//module.exports=dishRouter;

// const dishIdRouter=express.Router({ mergeParams: true });

// dishIdRouter.use(bp.json());

dishRouter.route('/:dishId')
.all((req,res,next)=>{   
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();   //next() calls other get or put or any other requests
})
.get((req,res,next)=>{
    res.end('Will send details of the dish: '+req.params.dishId +' to you!');
})
.post((req,res,next)=>{
    res.end('POST operation not supported on /dishes/'+req.params.dishId);
})
.put((req,res,next)=>{
    res.write('Updating the dish:'+req.params.dishId);
    res.end('Will update the dish: '+req.body.name+' with details: '+req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting dish: '+req.params.dishId);
});

module.exports=dishRouter;