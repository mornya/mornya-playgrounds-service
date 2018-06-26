export default {
  userId: { type: String, required: true }, // Identifier
  groupName: { type: String, default: 'default' },
  files: [
    {
      fileId: { type: String, required: true },
      physicalName: { type: String, required: true },
      originalName: { type: String, required: true },
      fileName: { type: String, required: true },
      size: { type: Number, required: true, default: 0 },
      encoding: { type: String },
      mimeType: { type: String },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      createdAt: { type: Date, required: true },
      updatedAt: { type: Date, required: true },
    },
  ],
};
