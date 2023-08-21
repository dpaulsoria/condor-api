const firebase = require("../../config/firebase");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const { uid } = require("uid");

const uploadFile = async (file, categoryFile) => {
  const storage = getStorage();
  const metadata = { contentType: "image/jpeg" };
  const [name, type] = file.originalname.split(".");
  const fileName = `${name}-${uid()}.${type}`;
  const storageRef = ref(storage, `${categoryFile}/${fileName}`);
  const upload = await uploadBytes(storageRef, file.buffer, metadata);

  return {
    type: categoryFile,
    url: await getDownloadURL(upload.ref),
    reference: upload.metadata.fullPath,
  };
};

const uploadMultipleImages = async (imagesArray, categoryImage) => {
  let images = [];

  if (imagesArray && imagesArray?.length > 0) {
    images = await Promise.all(
      imagesArray?.map((image) => uploadFile(image, categoryImage))
    ).catch((e) => {
      console.log(`${e.message}`)
      throw new Error("Error. uploadMultiple images: ", +e.message);
    });
  }
  return images;
};

module.exports = {
  uploadFile,
  uploadMultipleImages,
};
