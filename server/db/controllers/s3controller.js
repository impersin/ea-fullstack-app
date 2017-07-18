var fs = require('fs');
var S3FS = require('s3fs');
var s3fsImpl = new S3FS('fifatalk', {
  accessKeyId: process.env.S3_ACCESS_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION
});

module.exports = function(req, res) {
  var file = req.files.file;
  var stream = fs.createReadStream(file.path);
  return s3fsImpl.writeFile(file.originalFilename, stream).then(function() {
    fs.unlink(file.path, function(err) {
      if (err) {
        console.error(err);
      }
    });
    res.send(file.originalFilename);
  });
};