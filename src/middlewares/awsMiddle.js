const aws = require("aws-sdk")

aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile = async(file) => {
    return new Promise(function(resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: '2006-03-01' }); // we will be using the s3 service of aws

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket", 
            Key: "abc/" + file.originalname,
            Body: file.buffer
        }


        s3.upload(uploadParams, function(err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log(data)
            console.log("File uploaded succesfully")
            return resolve(data.Location)
        })

    })
}


const awsGenerator = async function(req, res, next) {

    try {
        let files = req.files
        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            req.swap = uploadedFileURL
            next()
        } else {
            return res.status(400).send({ msg: "No file found" })
        }

    } catch (err) {
        return res.status(500).send({ msg: err })
    }

}

module.exports.awsGenerator = awsGenerator