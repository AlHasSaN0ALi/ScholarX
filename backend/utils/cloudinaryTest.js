const { cloudinary } = require('./cloudinaryConfig');

/**
 * Test Cloudinary connection and configuration
 */
const testCloudinaryConnection = async () => {
    try {
        console.log('Testing Cloudinary connection...');
        
        // Test basic connection
        const result = await cloudinary.api.ping();
        console.log('Cloudinary connection successful:', result);
        
        // Test upload configuration
        const uploadTest = await cloudinary.uploader.upload(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
            {
                folder: 'test_uploads',
                resource_type: 'image'
            }
        );
        
        console.log('Test upload successful:', uploadTest.secure_url);
        
        // Clean up test upload
        await cloudinary.uploader.destroy(uploadTest.public_id);
        console.log('Test upload cleaned up');
        
        return { success: true, message: 'Cloudinary is properly configured' };
    } catch (error) {
        console.error('Cloudinary test failed:', error);
        return { success: false, message: error.message };
    }
};

module.exports = { testCloudinaryConnection };
