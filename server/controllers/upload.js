
const uploadpost = require('../models/upload');
const Profile = require('../models/Profile');
const jwt=require('jsonwebtoken')

exports.uploadImage = async (req, res) => {
    try {
        console.log("upload called")
        const { description,token,name } = req.body;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const rollNo=decoded.rollNo;
        const image = req.file.filename;
            console.log(description)
            console.log(rollNo)
            console.log(req.file.filename)
            
            
             

        const newpost = await uploadpost.create({
            description,
            image,
            name,
            rollNo,
            
        });
        
        const post = await Profile.findOneAndUpdate(
            { rollNo },
            { $push: { posts: newpost._id } },
            { new: true }
          ).populate('posts');
          
          res.status(200).json({
           
            newpost
          })
          
       
    } catch (err) {
        console.log(err)
    }
};

exports.getAllUploads=async(req,res) =>{
    try{
                
               
                
                const uploads = await uploadpost.find().sort({ createdAt: -1 });
                      
                res.status(200).json(uploads);
          
         
    }
    catch{
        res.status(500).json({ error: error.message });
    }
}
exports.getmyUploads=async(req,res) =>{
    try{
                
                console.log("my called")
                const {rollNo}=req.body;
                console.log("roll",rollNo)
                const uploads = await uploadpost.find({rollNo}).populate('profileid').sort({ createdAt: -1 });
                console.log(uploads)        
                res.status(200).json(uploads);
          
        
    }
    catch{
        res.status(500).json({ error: error.message });
    } 
}

exports.deleteUpload = async (req, res) => {
    try {
        const { postId } = req.params;

        const deletedPost = await uploadpost.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        console.log("Deleted post ID:", postId);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
