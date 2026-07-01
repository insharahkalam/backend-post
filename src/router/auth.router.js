import express from "express";
import { createUser, loginUser, logOut, forgotPass, resetPassword } from "../controllers/auth.controller.js";
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() })

const authRoute = express.Router()

authRoute.post('/users', upload.single("image"), createUser);
authRoute.post('/loginUser', loginUser);
authRoute.post('/forgot-password', forgotPass)
authRoute.post("/reset-password", resetPassword);
authRoute.get('/logout', logOut)


export default authRoute