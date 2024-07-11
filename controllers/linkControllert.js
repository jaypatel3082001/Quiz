// async function generateDownloadLink(fileName) {
//     try {
//       const authResponse = await b2.authorize();
//       // console.log("Authorization response:", authResponse.data);
  
//       const bucketId = B2_BUCKET_ID;
//       const bucketName = B2_BUCKET_NAME;
  
//       const fileNamePrefix = "sourceid/"; // Ensure this is set correctly, example: 'sourceid/'
//       const fullPath = `${fileNamePrefix}${fileName}`; // Full path includes the prefix
  
//       const downloadAuth = await b2.getDownloadAuthorization({
//         bucketId,
//         fileNamePrefix,
//         validDurationInSeconds: 3600, // Valid for 1 hour
//         //b2ContentDisposition: 'inline'
//       });
  
//       // console.log("Download authorization response:", downloadAuth);
  
//       if (!downloadAuth.data.authorizationToken) {
//         throw new Error("Authorization token is undefined.");
//       }
  
//       const baseUrl = authResponse.data.downloadUrl + "/file/" + bucketName + "/";
//       const presignedUrl = `${baseUrl}${fullPath}?Authorization=${downloadAuth.data.authorizationToken}`;
  
//       return presignedUrl;
//     } catch (error) {
//       console.error("Error generating presigned URL:", error);
//       return null;
//     }
//   }

//   module.exports={generateDownloadLink}