const express = require("express")
const Task = require("../models/task")
const auth = require("../middleware/auth")
const router = express.Router();

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task)
    }
    catch {
        res.status(400).send(e);
    }
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === "true"
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1
    }
    try{
        // const tasks = await Task.find({owner: req.user._id})

        // alternative
        console.log('rewq', req.user)
        // await req.user.populate("tasks")
        await req.user.populate({
            path: "tasks",
            match,
            options: {
                skip: parseInt(req.query.skip),
                limit: parseInt(req.query.limit),
                sort: {
                    completed: -1
                }
            }
        })

        res.send(req.user.tasks)
    }
    catch(e) {
        res.status(500).send(`${e.message}`);
    }
})

router.get('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id
    try {
        // const task = await Task.findById(req.params.id);
        // const task = await Task.findOne({_id, owner: req.user._id})

        // alternative

        await req.user.populate("tasks")
        res.send(req.user.tasks)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch {
        res.status(500).send();
    }
})


// without auth
// router.patch('/tasks/:id', async (req, res) => {
//     const updates = Object.keys(req.body);
//     const isAllowed = ['description', 'completed']

//     const isValid = updates.every((update) => isAllowed.includes(update))
//     if(!isValid){
//         return res.status(400).send({"error": "Invalid updates!"})
//     }
//     try {
//         const task = await Task.findById(req.params.id)
//         updates.forEach((update) => task[update] = req.body[update])
//         await task.save();

//         // const tasks = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

//         if(!tasks){
//             return res.status(404).send();
//         }
//         return res.send(tasks);
//     }
//     catch(e) {
//         res.status(400).send(e);
//     }
// })

router.patch('/tasks/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const isAllowed = ['description', 'completed']

    const isValid = updates.every((update) => isAllowed.includes(update))
    if(!isValid){
        return res.status(400).send({"error": "Invalid updates!"})
    }
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        // updates.forEach((update) => task[update] = req.body[update])
        // await task.save();
        // return res.send(task);
        // const tasks = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if(!task){
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save();
        return res.send(task);
    }
    catch(e) {
        res.status(400).send(e.message);
    }
})


// delete before authentication
// router.delete('/tasks/:id', async (req, res) => {
//     try{
//         const tasks = await Task.findByIdAndDelete(req.params.id);
//         if(!tasks){
//             return res.status(404).send()
//         }
//         return res.status(tasks)
//     }
//     catch(e) {
//         res.status(500).send(e)
//     }
// })

router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const tasks = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!tasks){
            return res.status(404).send()
        }
        return res.status(tasks)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router;