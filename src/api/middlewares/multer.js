const { errorResponse } = require("../utils/responseApi");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userFilesUpload = upload.fields([
  { name: "profileImage", maxCount: 2 },
  { name: "car", maxCount: 5 },
  { name: "carPlate", maxCount: 3 },
]);

const multerUserMiddleware = (req, res, next) => {
  userFilesUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) { 
      return res
        .status(400)
        .json(
          errorResponse(
            `Ocurrió un error al subir los archivos - ${err.message} '${err.field}'`,
            res.statusCode
          )
        );
    } else if (err) {
      return res
        .status(500)
        .json(
          errorResponse(
            "Ocurrió un error al subir los archivos.",
            res.statusCode
          )
        );
    }

    return next();
  });
};

module.exports = {
  multerUserMiddleware,
};
