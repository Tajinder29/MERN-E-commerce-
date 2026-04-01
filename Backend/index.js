const PORT=4000;
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const jwt =require("jsonwebtoken");
const multer =require("multer");
const path =require("path");
const cors=require("cors");
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb+srv://tajinderkaur30hr:tajinder123@cluster0.szf9j6y.mongodb.net/e-commerce")
.then(()=>{
    console.log("MongoDB Connected ✅");
})
.catch((err) => {
    console.log("MongoDB Error ❌", err);
});

app.get("/",(req,res)=>{
   res.send("express is working on /");
})

const storage=multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})
const upload=multer({storage:storage});
app.use('/images',express.static("upload/images"));
app.post("/upload",upload.single('image'),(req,res)=>{
    console.log(req.file);
    res.json({
        success:1,
        image_url:`http://localhost:${PORT}/images/${req.file.filename}`
    })
})
const Product=mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:String,
        required:true,
    },
    old_price:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    }
})
app.post("/addProduct",async(req,res)=>{
    let products=await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array=products.slice(-1);
        let last_product=last_product_array[0];
        id=last_product.id+1;
    }
    else{
        id=1;
    }
    const product=new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    }); 
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})
app.post("/removeProduct",async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    res.json({
        success:true,
        name:req.body.name
    })
})
app.get("/allProducts",async(req,res)=>{
    let products=await Product.find({});
    res.send(products);
})

//user schema
const Users=mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,

    },
    date:{
        type:Date,
        default:Date.now,
        }
})

app.post('/signup',async(req,res)=>{
    let check=await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing the user"});
    }
    let cart={};
    for(let i=0;i<300;i++){
        cart[i]=0;
    }
    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();
    const data={
        user:{
            id:user.id
        }
    }
    const token=jwt.sign(data,'secret_key');
    res.json({success:true,token});
})

app.post("/login",async(req,res)=>{
    let user=await Users.findOne({email:req.body.email});
    if(user){
        const passComp=req.body.password===user.password;
        if(passComp){
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,'secret_key');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"wrong password"});
        }
    }
    else{
        res.json({success:false,errors:"wrong email id"});
    }
})
//creating endpoint for newcollection data
app.get("/newcollections",async(req,res)=>{
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);// get recently added 8 products
    console.log("new collections");
    res.send(newcollection);
})
//create endpoint for popular in women 
app.get("/popularinwomen",async(req,res)=>{
    let products=await Product.find({category:"women"});
    let popular= products.slice(0,4);
    console.log("popular in women");
    res.send(popular);
})
//creating middleware to fetch user
const fetchUser=async(req,res,next)=>{
const token=req.header('auth-token');
if(!token){
    res.status(401).send({errors:"please authenticate"})
}
else{
    try{
        const data=jwt.verify(token,'secret_key');
        req.user=data.user;
        next();
    }
    catch(err){
        
        res.status(401).send({errors:"please authenticate using valid token"})
    }
}
}
//creating endpoint for cartProducts to store in database
app.post("/addtocart",fetchUser,async(req,res)=>{
    console.log("added",req.body.itemId);
   let userData=await Users.findOne({_id:req.user.id});
   userData.cartData[req.body.itemId]+=1;
   await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
   res.send("added");
})
app.post("/removefromcart",fetchUser,async(req,res)=>{
    console.log("removed",req.body.itemId);
   let userData=await Users.findOne({_id:req.user.id});
   if(userData.cartData[req.body.itemId]>0)
   userData.cartData[req.body.itemId]-=1;
   await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
   res.send("Removed");
})
app.post("/getcart",fetchUser,async(req,res)=>{
    let userData=await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})


app.listen(PORT, "0.0.0.0", (err) => {
  if (!err) {
    console.log("server is running at PORT:4000");
  }
});