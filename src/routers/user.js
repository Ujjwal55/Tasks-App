const express = require("express")
const User = require("../models/user")
const auth = require("../middleware/auth")
const router = express.Router()

router.post('/users', async (req, res) => {
    let user = new User(req.body)
    try{
        user = await user.save();
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }
    catch (e){
        res.status(400).send(e.message)
    }
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.post("/users/login", async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // res.send({user: user.getPublicProfile(), token})
        res.send({user, token})
    }
    catch(e){
        console.log("error", e)
        res.status(400).send(e.message)
    }
})


router.post("/users/logout", auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})


router.post("/users/logout/all", auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send();
    }
    catch(e){
        res.status(500).send()
    }
})
// router.get('/users', auth, async (req, res) => {
//     try{
//         const users = await User.find({})
//         res.send(users)
//     }
//     catch {
//         res.status(500).send();
//     }
//     // User.find({}).then((users) => {
//     //     res.send(users)
//     // }).catch((e) => {
//     //     res.status(500).send(e)
//     // })
// })

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user)
})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     try{
//         const user = User.findById(_id);
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user);
//     }
//     catch {
//         res.status(500).send();
//     }
//     // User.findById(_id).then((user) => {
//     //     if(!user){
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

// don't need this
// router.patch('/users/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
//     if(!isValidOperation){
//         return res.status(400).send({error: 'Invalid updates!'})
//     }
//     try{
//         const user = await User.findById(req.params.id)
//         updates.forEach((update) => user[update] = req.body[update])
//         await user.save()

//         // we have commented this because we cannot use middleware with findByIdAndUpdate
//         // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

//         if(!user){
//             return res.status(404).send()
//         }

//         res.send(user)
//     }
//     catch(e) {
//         res.status(400).send(e)
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try{
        // const user = await User.findById(req.user._id)
        updates.forEach((update) => req.user[update] = req.body[update])
        
        // it is important to save to database
        await req.user.save()
        res.send(req.user)
    }
    catch(e) {
        res.status(400).send(e.message)
    }
})

// we don't need this after auth
// router.delete('/users/:id', async (req, res) => {
//     try{
//         const user = await User.findByIdAndDelete(req.params.id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }
//     catch(e) {
//         res.status(500).send()
//     }
// })

router.delete('/users/me',auth, async (req, res) => {
    try{
        await req.user.remove();
        res.send(req.user)
    }
    catch(e) {
        res.status(500).send(e.message)
    }
})

module.exports = router;