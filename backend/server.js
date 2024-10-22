import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import expertRouter from "./routes/expertRoute.js"
import adminRouter from "./routes/adminRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/expert", expertRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

// app.listen(port, () => console.log(`Server started on PORT:${port}`))
app.listen(port || '0.0.0.0', () => {
  console.log(`Server running on port ${port || 3000}`);
});
