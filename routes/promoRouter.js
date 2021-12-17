const express=require('express');
const bp=require('body-parser');

const promoRouter=express.Router({ mergeParams: true });

promoRouter.use(bp.json());

promoRouter.route('/')
.all((req,res,next)=>{   
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();   //next() calls other get or put or any other requests
})
.get((req,res,next)=>{
    res.end('Will send all promos soon!');
})
.post((req,res,next)=>{
    res.end('Will add the promo: '+req.body.name+' with details: '+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req,res,next)=>{
    res.end('Deleting all the promotions');
});

// module.exports=promoRouter;

// const promoIdRouter=express.Router({ mergeParams: true });

// promoIdRouter.use(bp.json());

promoRouter.route('/:promoId')
.all((req,res,next)=>{   
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();   //next() calls other get or put or any other requests
})
.get((req,res,next)=>{
    res.end('Will send details of the promo: '+req.params.promoId +' to you!');
})
.post((req,res,next)=>{
    res.end('POST operation not supported on /promotions/'+req.params.promoId);
})
.put((req,res,next)=>{
    res.write('Updating the promo:'+req.params.promoId);
    res.end('Will update the promo: '+req.body.name+' with details: '+req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting promo: '+req.params.promoId);
});

module.exports=promoRouter;