import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function useImages() {
  const inputRef = useRef();
  const [images, setImages] = useState([]);

  const handleUpload = useCallback((e) => {
    const newImages = [...e.target.files].map((file) => {
      if (file.size > MAX_FILE_SIZE) {
        console.error(`File ${file.name} exceeds the maximum file size.`);
        return null;
      }
//--------------------------------------------------------------------------------------------------//
      return {
        name: file.name,
        url: URL.createObjectURL(file),
      };
    }).filter(Boolean);

    setImages((prevImages) => [...prevImages, ...newImages]);
  }, []); // 確認資料正確性

  const handleRemove = useCallback((itemIndex) => {
    setImages((prevImages) => {
      const imageToRemove = prevImages[itemIndex];
      URL.revokeObjectURL(imageToRemove.url);
      const updatedImages = prevImages.filter((_, index) => index !== itemIndex);
      return updatedImages;
    });
  }, []); // Ensure dependencies are appropriate

  const handleRemoveAll = useCallback(() => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.url);
    });
    setImages([]);
  }, [images]);

  useEffect(() => {
    if (images.length === 0 && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [images]);

  const expensiveCalculation = useMemo(() => {
    return result;
  }, [dependencies]);

  return {
    images,
    handleUpload,
    handleRemove,
    handleRemoveAll,
    inputRef,
    maxFileSize: MAX_FILE_SIZE,
  };
}

export default useImages;
