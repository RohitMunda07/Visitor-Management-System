import connectDB from "../DB/connectDB.js";
import app from "../Src/app.js";
import dotenv from "dotenv"

dotenv.config({
    path: './env'
});

connectDB();

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send("hello world");
})

app.listen(PORT, () => {
    console.log("server is listening at PORT", PORT);
})