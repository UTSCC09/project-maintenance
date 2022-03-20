const { GraphQLUpload } = require('graphql-upload');
const { finished } = require('stream/promises');
const { User } = require('./userSchema');

const fileUploadDef = `
  # The implementation for this scalar is provided by the
  # 'GraphQLUpload' export from the 'graphql-upload' package
  # in the resolver map below.
  scalar Upload

  type File {
    filepath: String!
    fileGetPath: String!
    mimetype: String!
    encoding: String!
  }
`;

const fileUploadQueryDef = `
  # This is only here to satisfy the requirement that at least one
  # field be present within the 'Query' type.  This example does not
  # demonstrate how to fetch uploads back.
  otherFields: Boolean!
`

const fileUploadMutDef =`
  # Multiple uploads are supported. See graphql-upload docs for details.
  profilePicUpload(file: Upload!): Boolean!
`

const fileUploadScalar = {
    Upload: GraphQLUpload,
};

const fileUploadMut = {
  // This maps the `Upload` scalar to the implementation provided
  // by the `graphql-upload` package.

  profilePicUpload: async (parent, { file }, context) => {
    const { createReadStream, filename, mimetype, encoding } = await file;

    // Invoking the `createReadStream` will return a Readable Stream.
    // See https://nodejs.org/api/stream.html#stream_readable_streams
    const stream = createReadStream();
    // This is purely for demonstration purposes and will overwrite the
    // local-file-output.txt in the current working directory on EACH upload.
    const fs = require('fs');
    if (!fs.existsSync(__dirname + '/files/')){
      fs.mkdirSync(__dirname + '/files/');
    }
    if (!fs.existsSync(__dirname + '/files/pictures')){
      fs.mkdirSync(__dirname + '/files/pictures');
    }
    const out = fs.createWriteStream(__dirname + '/files/pictures/' + context.getUser().email + '.pic');
    stream.pipe(out);
    await finished(out);
    const res = await User.updateOne({ email: context.getUser().email },
                                        { profilePic: { fileGetPath: 'https://drhandyman.me:4000/pictures/'+context.getUser().email + '.pic', filepath: __dirname + '/files/pictures/' + context.getUser().email + '.pic', mimetype, encoding }});
    return res.acknowledged;
  },
};

module.exports = {
    fileUploadScalar,
    fileUploadDef,
    fileUploadMut,
    fileUploadMutDef,
    fileUploadQueryDef,
};
