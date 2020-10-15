const express = require('express');

const app = express();

const morgan = require('morgan');

const bodyParse = require('body-parser');

const mongoose = require('mongoose');

const userRoutes = require('./api/routes/users');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');


app.use(bodyParse.urlencoded({extended : true}));
app.use(bodyParse.json());

mongoose.connect('mongodb+srv://rohit:'+process.env.MONGO_ATLAS_DB_PW+'@cluster0-9orz6.mongodb.net/<dbname>?retryWrites=true&w=majority',
{ useNewUrlParser: true ,useUnifiedTopology: true });
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads')); // making this folder publically available to everyone

// %%%%%%%%%%% Preventing CORS erros %%%%%%%%%%%%%% //
app.use(( req,res,next )=> {
    res.header('Access-Control-Allow-Origin','*');

    res.header('Access-Constrol-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','POST,GET,PATCH,DELETE,UPDATE');
        return res.status(200).json({});
    }
    next();
});

/// %%%%%%%%%%%%%%%%%%%%%%%%%%%% CORS  %%%%%%%%%%%%%%%%%555

// app.use sets up a method as middleware so the incoming request has to go app and what we pass top it  and to move the request to the next middleware in line and if not executed the request will not go there

// here /product is a request filter which will pass  will then be handled by a handler
//routes that handle request 
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);

// handling error if we find none of the routes the
app.use ( (req,res,next) => {
    const error = new Error("Invalid Url");
    error.status=404;
    // forwarding this error request
    next(error);
});


app.use((err,req,res,next) => {
    res.status(err.status || 500);
    res.json({
        error : {
            message : err.message,
            "info" : "route_not_found" 
        }
    });
});


module.exports = app;