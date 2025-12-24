import multer from "multer"
import fs, { mkdirSync } from "fs"

const TEMP_DIR = './Public/temp';
if (!TEMP_DIR) {
    mkdirSync(TEMP_DIR, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, TEMP_DIR);
    },
    filename: (req, file, cb) => {
        console.log("Multer file:", file);

        cb(null, file.originalname);
    }
});

export const upload = multer({ storage: storage })