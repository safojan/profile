const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'guidelinesync-guidelines';

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} key - S3 object key
 * @param {string} contentType - File content type
 * @returns {Promise<string>} - S3 object URL
 */
const uploadToS3 = async (fileBuffer, key, contentType = 'application/pdf') => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ServerSideEncryption: 'AES256', // Enable encryption
      Metadata: {
        uploadedAt: new Date().toISOString(),
      },
    });

    await s3Client.send(command);

    // Return the S3 URL
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'eu-west-2'}.amazonaws.com/${key}`;
    return url;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
};

/**
 * Get file from S3
 * @param {string} key - S3 object key
 * @returns {Promise<Buffer>} - File buffer
 */
const getFromS3 = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    
    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    
    return Buffer.concat(chunks);
  } catch (error) {
    console.error('S3 get error:', error);
    throw new Error('Failed to get file from S3');
  }
};

/**
 * Delete file from S3
 * @param {string} key - S3 object key
 * @returns {Promise<void>}
 */
const deleteFromS3 = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete file from S3');
  }
};

/**
 * Generate presigned URL for direct upload
 * @param {string} key - S3 object key
 * @param {number} expiresIn - URL expiration time in seconds
 * @returns {Promise<string>} - Presigned URL
 */
const generatePresignedUrl = async (key, expiresIn = 3600) => {
  try {
    const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: 'application/pdf',
      ServerSideEncryption: 'AES256',
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Presigned URL error:', error);
    throw new Error('Failed to generate presigned URL');
  }
};

module.exports = {
  uploadToS3,
  getFromS3,
  deleteFromS3,
  generatePresignedUrl,
};

