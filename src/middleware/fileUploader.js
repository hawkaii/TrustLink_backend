import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import sharp from "sharp";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureUploadsDirExists = async () => {
  const foldersToCreate = [
    "uploads",
    "uploads/low_quality",
    "uploads/medium_quality",
  ];
  for (const folderPath of foldersToCreate) {
    const relativeFolderPath = folderPath.split("/");
    const uploadsDir = path.join(__dirname, "..", "..", ...relativeFolderPath);
    try {
      await fs.access(uploadsDir); // This checks for existence
    } catch (err) {
      console.log(err);
      await fs.mkdir(uploadsDir, { recursive: true });
    }
    // if (!await fs.existsSync(uploadsDir)) {
    //   await fs.mkdirSync(uploadsDir, { recursive: true }); // Create uploads folder if it doesn't exist
    // }
  }
};

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     ensureUploadsDirExists();
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const fileName = Date.now() + path.extname(file.originalname);
//     cb(null, fileName);
//   },
// });

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB (in bytes)
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false); // Reject the file
    }
  },
});

const compressedImage = async (buffer, format) => {
  format = format.split("/")[1];
  let compressedImage = {
    highlyCompressedBuffer: "",
    mediumCompressedBuffer: "",
  };
  switch (format) {
    case "jpeg":
    case "jpg":
      compressedImage.highlyCompressedBuffer = await sharp(buffer)
        .jpeg({ quality: 1 })
        .toBuffer();
      compressedImage.mediumCompressedBuffer = await sharp(buffer)
        .jpeg({ quality: 30 })
        .toBuffer();
      break;

    case "png":
      compressedImage.highlyCompressedBuffer = await sharp(buffer)
        .png({ quality: 1 })
        .toBuffer();
      compressedImage.mediumCompressedBuffer = await sharp(buffer)
        .png({ quality: 30 })
        .toBuffer();
      break;

    case "gif":
      compressedImage.highlyCompressedBuffer = await sharp(buffer)
        .png({ quality: 1 })
        .toBuffer();
      compressedImage.mediumCompressedBuffer = await sharp(buffer)
        .png({ quality: 30 })
        .toBuffer();
      break;
    default:
      throw new Error("Unsupported Image");
  }
  return compressedImage;
};

export const uploadAndCompress = async (req, res, next) => {
  try {
    if (!req.files || req.files.length == 0) {
      return next();
    }
    ensureUploadsDirExists();
    for (const file of req.files) {
      const buffer = file.buffer;
      const { highlyCompressedBuffer, mediumCompressedBuffer } =
        await compressedImage(buffer, file.mimetype);
      const highlyCompressedPath =
        "./uploads/low_quality/" +
        `${Date.now() + path.extname(file.originalname)}`;
      const mediumCompressedPath =
        "./uploads/medium_quality/" +
        `${Date.now() + path.extname(file.originalname)}`;
      await fs.writeFile(highlyCompressedPath, highlyCompressedBuffer);
      await fs.writeFile(mediumCompressedPath, mediumCompressedBuffer);
      file.highlyCompressedPath = highlyCompressedPath;
      file.mediumCompressedPath = mediumCompressedPath;
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error compressing image" });
  }
};

export const uploadFile = upload.single("image");
export const uploadMultipleFiles = upload.array("image", 5);
