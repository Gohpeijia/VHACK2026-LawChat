import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export interface CaptureResult {
  base64: string;
  mimeType: string;
  dataUrl: string;
}

export async function capturePhoto(): Promise<CaptureResult | null> {
  if (!Capacitor.isNativePlatform()) {
    return null; // Fall back to file input on web
  }

  const photo = await Camera.getPhoto({
    quality: 90,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera,
    allowEditing: false,
  });

  if (!photo.base64String) return null;

  const mimeType = `image/${photo.format}`;
  const dataUrl = `data:${mimeType};base64,${photo.base64String}`;

  return {
    base64: photo.base64String,
    mimeType,
    dataUrl,
  };
}

export async function pickFromGallery(): Promise<CaptureResult | null> {
  if (!Capacitor.isNativePlatform()) {
    return null; // Fall back to file input on web
  }

  const photo = await Camera.getPhoto({
    quality: 90,
    resultType: CameraResultType.Base64,
    source: CameraSource.Photos,
    allowEditing: false,
  });

  if (!photo.base64String) return null;

  const mimeType = `image/${photo.format}`;
  const dataUrl = `data:${mimeType};base64,${photo.base64String}`;

  return {
    base64: photo.base64String,
    mimeType,
    dataUrl,
  };
}
