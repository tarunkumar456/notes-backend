const catchasyncerror = require("../middleware/catchasyncerror");
const userModels = require("../models/userModels");
const ErrorHandler = require('../utils/errorhandler');
const sendtoken = require('../utils/jwttoken');
const jwt = require('jsonwebtoken')

exports.registerUser = catchasyncerror(async (req, resp) => {
    const { name, email, password } = req.body;
    const user = await userModels.create({
        name, email, password
    })
    sendtoken(user, 201, resp);
})
//login user
exports.loginUser = catchasyncerror(async (req, resp, next) => {
    const { email, password } = req.body;
    //check if both present
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await userModels.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invlaid Email & Password", 401))
    }
    const isPasswordMatched = await user.comparepassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invlaid Email & Password", 401))
    }

    sendtoken(user, 200, resp);
})

//logout user
exports.logout = catchasyncerror((req, resp, next) => {

    resp.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    resp.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

//get all notes
exports.getNotes = catchasyncerror(async (req, resp, next) => {
    let user = await userModels.find({ _id: req.user._id });
    if (!user) return next(new ErrorHandler("User not found", 404))
    let notes = user[0]

    resp.status(200).json({
        success: true,
        notes
    });
})


//add notes
exports.addNotes = catchasyncerror(async (req, resp, next) => {
    const newnote = {
        title: req.body.title,
        discription: req.body.discription
    }
    const user = await userModels.find({ _id: req.user._id });
    if (!user) return next(new ErrorHandler("User not found", 404))
    user[0].notes.push(newnote)
    await user[0].save({ validateBeforeSave: false });
    resp.status(200).json({
        success: true,
        user
    });
})

//delete notes
exports.deleteNotes = catchasyncerror(async (req, resp, next) => {
    // console.log(req.body)
    const user = await userModels.find({ _id: req.user._id });
    if (!user) return next(new ErrorHandler("User not found", 404))
    const Notes = user[0].notes.filter(note => { return (note._id.toString() !== req.body.id.toString()) })
    user[0].notes = Notes;
    await user[0].save();
    resp.status(200).json({
        success: true,
        user
    });
})


//edit notes
exports.editNotes = catchasyncerror(async (req, resp, next) => {
    // console.log(req.body)
    const user = await userModels.find({ _id: req.user._id });
    if (!user) return next(new ErrorHandler("User not found", 404))
    user[0].notes.map(note => {
        if (note._id.toString() === req.body.id.toString()) {
            note.title = req.body.title,
                note.discription = req.body.discription
        }
    })
    // user[0].notes = Notes;
    await user[0].save();
    // console.log(user[0].notes)
    resp.status(200).json({
        success: true,
        user
    });
})

//get note
exports.getNote = catchasyncerror(async (req, resp, next) => {
    // console.log(req.body)
    const user = await userModels.find({ _id: req.user._id });
    if (!user) return next(new ErrorHandler("User not found", 404))
    let Note;
    user[0].notes.map(note => {
        if (note._id.toString() === req.body.id.toString()) {
            Note = note;
        }
    })
    if (!Note) return next(new ErrorHandler("Note not found", 404))
    resp.status(200).json({
        success: true,
        Note
    });
})

//authenticated
exports.isAuth = catchasyncerror(async (req, resp, next) => {
    const { token } = req.cookies;
    console.log(req.cookies);
    if (!token) {
        return next(new ErrorHandler("please login to access it", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await userModels.findById(decoded.id);
    resp.status(200).json({
        success: true
    });


})

