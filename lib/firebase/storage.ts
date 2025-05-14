import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { getApp } from "firebase/app"

// Get Storage instance
const storage = getStorage(getApp())

// Upload a file to Firebase Storage
export async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

// Upload multiple files to Firebase Storage
export async function uploadFiles(files: File[], basePath: string): Promise<string[]> {
  const uploadPromises = files.map((file, index) => {
    const path = `${basePath}/${Date.now()}_${index}_${file.name}`
    return uploadFile(file, path)
  })

  return Promise.all(uploadPromises)
}

// Delete a file from Firebase Storage
export async function deleteFile(url: string): Promise<void> {
  const fileRef = ref(storage, url)
  await deleteObject(fileRef)
}
