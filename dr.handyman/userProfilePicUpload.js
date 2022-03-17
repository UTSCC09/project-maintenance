const { GraphQLUpload } = require('graphql-upload');
const { finished } = require('stream/promises');

const fileUploadDef = `
  # The implementation for this scalar is provided by the
  # 'GraphQLUpload' export from the 'graphql-upload' package
  # in the resolver map below.
  scalar Upload

  type File {
    filepath: String!
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
    profilePicUpload(file: Upload!): File!
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
    const out = require('fs').createWriteStream('./profilepics/' + context.getUser().email + '.pic');
    stream.pipe(out);
    await finished(out);

    return { filepath: './profilepics/' + context.getUser().email + '.pic', mimetype, encoding };
},
};

module.exports = {
    fileUploadScalar,
    fileUploadDef,
    fileUploadMut,
    fileUploadMutDef,
    fileUploadQueryDef,
};
