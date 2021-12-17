const express=require('express');
const bp=require('body-parser');

const leaderRouter=express.Router({ mergeParams: true });

leaderRouter.use(bp.json());

leaderRouter.route('/')
.all((req,res,next)=>{   
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();   //next() calls other get or put or any other requests
})
.get((req,res,next)=>{
    res.end('Will send all leaders soon!');
})
.post((req,res,next)=>{
    res.end('Will add the leader: '+req.body.name+' with details: '+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req,res,next)=>{
    res.end('Deleting all the leaders');
});

// module.exports=leaderRouter;

// const leaderIdRouter=express.Router({ mergeParams: true });

// leaderIdRouter.use(bp.json());

leaderRouter.route('/:leaderId')
.all((req,res,next)=>{   
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();   //next() calls other get or put or any other requests
})
.get((req,res,next)=>{
    res.end('Will send details of the leader: '+req.params.leaderId +' to you!');
})
.post((req,res,next)=>{
    res.end('POST operation not supported on /leaders/'+req.params.leaderId);
})
.put((req,res,next)=>{
    res.write('Updating the leader:'+req.params.leaderId);
    res.end('Will update the leader: '+req.body.name+' with details: '+req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting leader: '+req.params.leaderId);
});

module.exports=leaderRouter;