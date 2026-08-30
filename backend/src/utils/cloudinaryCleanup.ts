import { cloudinary } from '../config/cloudinary';

/**
 * Extracts Cloudinary publicId from a secure URL or returns the ID if already clean.
 * Handles URLs like:
 * https://res.cloudinary.com/cloud_name/image/upload/v1234567890/dot_inspire/sample_xyz.jpg
 * -> 'dot_inspire/sample_xyz'
 */
export const extractCloudinaryPublicId = (urlOrId: string | null | undefined): string | null => {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const trimmed = urlOrId.trim();
  if (!trimmed) return null;

  // If already a public_id (doesn't start with http:// or https://)
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Ensure it is a cloudinary URL
  if (!trimmed.includes('res.cloudinary.com')) {
    return null;
  }

  try {
    const urlObj = new URL(trimmed);
    const pathname = urlObj.pathname; // e.g. /cloud_name/image/upload/v12345/dot_inspire/abc.jpg

    const uploadIndex = pathname.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    let pathAfterUpload = pathname.substring(uploadIndex + '/upload/'.length);

    // Remove any transformation parameters and version tags (e.g., 'v123456789/')
    // Match version prefix 'v\d+/'
    pathAfterUpload = pathAfterUpload.replace(/^(?:[a-zA-Z0-9_]+,[a-zA-Z0-9_,-]+\/)?v\d+\//, '');

    // Strip extension (.jpg, .png, .webp, etc.)
    const lastDotIndex = pathAfterUpload.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
    }

    return pathAfterUpload || null;
  } catch (error) {
    console.error('Failed to parse Cloudinary URL:', error);
    return null;
  }
};

/**
 * Deletes a single image asset from Cloudinary by URL or publicId.
 * Silently catches errors to prevent blocking database deletes.
 */
export const deleteCloudinaryImage = async (urlOrId: string | null | undefined): Promise<void> => {
  const publicId = extractCloudinaryPublicId(urlOrId);
  if (!publicId) return;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,
    });
    console.log(`Cloudinary asset deleted [${publicId}]:`, result?.result);
  } catch (error) {
    console.error(`Error deleting Cloudinary asset [${publicId}]:`, error);
  }
};

/**
 * Deletes multiple image assets from Cloudinary.
 */
export const deleteMultipleCloudinaryImages = async (urlsOrIds: (string | null | undefined)[]): Promise<void> => {
  const validIds = urlsOrIds
    .map(extractCloudinaryPublicId)
    .filter((id): id is string => Boolean(id));

  if (validIds.length === 0) return;

  // Deduplicate IDs
  const uniqueIds = Array.from(new Set(validIds));

  try {
    await Promise.allSettled(
      uniqueIds.map((id) =>
        cloudinary.uploader.destroy(id, {
          resource_type: 'image',
          invalidate: true,
        })
      )
    );
    console.log(`Cloudinary bulk delete completed for ${uniqueIds.length} assets`);
  } catch (error) {
    console.error('Error during bulk Cloudinary deletion:', error);
  }
};
