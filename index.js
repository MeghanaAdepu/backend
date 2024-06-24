const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const UserModel = require('./models/Users')

const app=express();
app.use(express.json())
app.use(cors({
    origin:'*' ,
    credentials: true// Replace with your actual frontend URL
}));


mongoose.connect("mongodb://localhost:27017/crud", {
}).then(() => {
    console.log("Successfully connected to MongoDB");
}).catch((error) => {
    console.error("Connection error", error);
});


app.get('/',(req,res)=>{
    UserModel.find({})
    .then(users=>res.json(users))
    .catch(err =>res.json(err))
})

// app.get('/user-details/:id', (req, res) => {
//     const id = req.params.id;
//     UserModel.findOne({ $or: [{ idno: id }, { name: id }, { email: id }] })
//         .then(user => {
//             if (user) {
//                 console.log("User found:", user);
//                 res.json(user);
//             } else {
//                 console.log("User not found with ID/Name/Email:", id);
//                 res.status(404).json({ error: "User not found" });
//             }
//         })
//         .catch(err => {
//             console.error("Error fetching user:", err);
//             res.status(500).json({ error: err.message });
//         });
// });

app.get('/user-details/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findOne({
            $or: [
                { idno: { $regex: new RegExp(id, 'i') } },
                { name: { $regex: new RegExp(id, 'i') } },
                { email: { $regex: new RegExp(id, 'i') } }
            ]
        });
        if (user) {
            console.log("User found:", user);
            res.json(user);
        } else {
            console.log("User not found with ID/Name/Email:", id);
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/getuser/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findOne({ idno: id }) // Use findOne instead of findById
        .then(user => {
            if (user) {
                console.log("User found:", user);
                res.json(user);
            } else {
                console.log("User not found with ID:", id);
                res.status(404).json({ error: "User not found" });
            }
        })
        .catch(err => {
            console.error("Error fetching user:", err); // Add logging
            res.status(500).json({ error: err.message });
        });
});

app.put("/updateuser/:id", (req, res) => {
    const id = req.params.id;
    const { idno, name, email, age,phno } = req.body; // Destructure fields from req.body

    // Update the user document with the specified id
    UserModel.findOneAndUpdate({ idno: id }, { idno, name, email, age ,phno}, { new: true }) // Use id instead of idno
        .then(user => {
            if (user) {
                console.log("User updated:", user);
                res.json(user);
            } else {
                console.log("User not found with ID:", id);
                res.status(404).json({ error: "User not found" });
            }
        })
        .catch(err => {
            console.error("Error updating user:", err);
            res.status(500).json({ error: err.message });
        });
});


app.post("/createuser",(req,res)=>{
    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})


app.delete('/deleteuser/:idno', async (req, res) => {
    const { idno } = req.params;
    try {
        const result = await UserModel.deleteOne({ idno: parseInt(idno, 10) });
        if (result.deletedCount === 0) {
            console.log("No user found with ID number:", idno);
            return res.status(404).send("User not found");
        }
        console.log("User deleted successfully with ID number:", idno);
        res.send("User deleted successfully");
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send("Failed to delete user");
    }
});


app.listen(process.env.PORT || 3001,()=>{
    console.log("Server is running")
})