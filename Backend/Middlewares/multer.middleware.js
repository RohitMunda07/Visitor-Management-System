import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"), false);
    } else {
      cb(null, true);
    }
  },
});

// ====================== OLD Multer Configuration ========================

// import multer from "multer"
// import fs, { mkdirSync } from "fs"

// const TEMP_DIR = './Public/temp';
// if (!TEMP_DIR) {
//     mkdirSync(TEMP_DIR, { recursive: true })
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, TEMP_DIR);
//     },
//     filename: (req, file, cb) => {
//         console.log("Multer file:", file);

//         cb(null, file.originalname);
//     }
// });

// export const upload = multer({ storage: storage })

