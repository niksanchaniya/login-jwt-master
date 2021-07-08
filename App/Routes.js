module.exports = (app) =>{
    const auth = require('./Auth.middleware');
    const User = require("./Model");
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");

    app.post("/signup",async(req,res)=>{
        try {
            let user = await User.findOne({ email: req.body.email });
            if(user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }
            user = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 10)
            });
            await user.save();
            const token = jwt.sign({  id: user.id }, 'randomString', {
                expiresIn: 86400 // 24 hours
            });
            res.status(200).json({
                token: token
            });

        }
        catch(err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    });

    app.post("/login", async(req, res) =>{

        try{
            let user = await User.findOne({ email: req.body.email });
            if(!user) return res.status(400).json({
                message:"User not exist"
            });
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if(!isMatch) return res.status(400).json({
                message: "Incorrect Password !"
            });
            const token = jwt.sign({  id: user.id }, 'randomString', {
                expiresIn: 86400 // 24 hours
            });
            res.status(200).json({
                token: token
            });
        }catch(err) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    });
    app.get("/me",auth,async(req,res)=>{
        try {
            const user = await User.findById(req.user.id);
            res.json(user);
        }catch{
            res.send({
                message: "Error in Fetching user"
            });
        }
    })


};