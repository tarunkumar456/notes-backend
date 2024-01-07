const express = require('express');
const { getNotes, registerUser, loginUser, logout, addNotes, deleteNotes, editNotes, getNote, isAuth } = require('../controllers/userController');
const isaunthenticated = require('../middleware/auth');

const router = express.Router();
router.get('/', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    res.send('cors problem fixed:)');
});
router.route('/notes').get(isaunthenticated,getNotes);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(isaunthenticated,logout);
router.route('/addnotes').put(isaunthenticated,addNotes);
router.route('/deletenotes').put(isaunthenticated,deleteNotes);
router.route('/editnotes').put(isaunthenticated,editNotes);
router.route('/getnote').post(isaunthenticated,getNote);
router.route('/islogin').get(isAuth);

module.exports = router;
