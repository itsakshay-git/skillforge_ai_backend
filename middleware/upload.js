const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".docx"]
  const ext = path.extname(file.originalname)
  if (!allowed.includes(ext)) return cb(new Error("Only PDF and DOCX allowed"))
  cb(null, true)
}

const upload = multer({ storage, fileFilter })
module.exports = upload
