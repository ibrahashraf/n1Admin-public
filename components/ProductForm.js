import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PuffLoader from 'react-spinners/PuffLoader';
import Image from 'next/image';
import { Delete } from '@mui/icons-material';

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  images: existingImages,
  category: existingCategory,
  variants: existingVariants,
  metaTitle: existingMetaTitle,
  metaDescription: existingMetaDescription
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [category, setCategory] = useState(existingCategory || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [images, setImages] = useState(existingImages || []);
  const [imageHovered, setImageHovered] = useState(null);
  const [variants, setVariants] = useState(existingVariants || []);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [metaTitle, setMetaTitle] = useState(existingMetaTitle || '');
  const [metaDescription, setMetaDescription] = useState(existingMetaDescription || '');
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/Categories').then(res => {
      setCategories(res.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { title, description, images, category, variants, metaTitle, metaDescription };
    
    if (!title || !description || !images.length || !category || !variants.length || !metaTitle || !metaDescription) {
      window.alert('Please fill in all fields');
      return;
    }

    if (_id) {
      await axios.put('/api/Products', { ...data, _id });
    } else {
      await axios.post('/api/Products', data);
    }
    router.push('/Products');
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/Upload', data);
      setImages(oldImages => [...oldImages, ...res.data.links]);
      setIsUploading(false);
    }
  }

  function removeImage(image) {
    // axios.delete('/api/Upload', { data: { image } });
    setImages(images.filter(img => img !== image));
  }

  function handleVariantChange(index, field, value) {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  }

  function addVariant() {
    setVariants([...variants, { size: '', color: '', stock: 1, price: null }]);
  }

  function removeVariant(index) {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  }

  return (
    <form onSubmit={saveProduct} className="flex flex-col gap-6">
      <input
        type="text"
        placeholder="Product name"
        required
        value={title}
        onChange={ev => setTitle(ev.target.value)}
        className="border border-gray-700 rounded-md px-4 py-2"
      />

      <select
        required
        className="border border-gray-700 rounded-md px-4 py-2"
        value={category}
        onChange={ev => setCategory(ev.target.value)}
      >
        <option disabled value="">- Select category -</option>
        {categories.length > 0 && categories.map(category => (
          <option key={category._id} value={category._id}>{category.name}</option>
        ))}
      </select>

      <div className="my-4">
        <h3 className="font-semibold text-black mb-3">Product Variants (Size, Color, Stock, Compare At Price, Price)</h3>
        <div className="flex flex-col gap-4">
          {variants.map((variant, index) => (
            <div key={index} className="flex flex-wrap gap-4 items-center">
              <input
                type="text"
                placeholder="Size"
                value={variant.size}
                onChange={ev => handleVariantChange(index, 'size', ev.target.value)}
                className="border border-gray-700 rounded-md px-3 py-2 w-24"
              />
              <input
                type="text"
                placeholder="Color"
                value={variant.color}
                onChange={ev => handleVariantChange(index, 'color', ev.target.value)}
                className="border border-gray-700 rounded-md px-3 py-2 w-24"
              />
              <input
                type="number"
                placeholder="Stock"
                value={variant.stock}
                onChange={ev => handleVariantChange(index, 'stock', ev.target.value)}
                className="border border-gray-700 rounded-md px-3 py-2 w-24"
              />
              <input
                type="number"
                placeholder="compare At Price"
                value={variant.compareAtPrice}
                onChange={ev => handleVariantChange(index, 'compareAtPrice', ev.target.value)}
                className="border border-gray-700 rounded-md px-3 py-2 w-24"
              />
              <input
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={ev => handleVariantChange(index, 'price', ev.target.value)}
                className="border border-gray-700 rounded-md px-3 py-2 w-24"
              />
              <button
                type="button"
                className="bg-black hover:bg-black text-white px-4 py-2 rounded-md transition"
                onClick={() => removeVariant(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addVariant}
          className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-md mt-4 transition"
        >
          Add Variant
        </button>
      </div>

      <div className="flex flex-wrap gap-5 items-center">
        <label className="text-sm border-2 border-gray-700 rounded-md flex flex-col gap-2 items-center justify-center h-32 w-32 cursor-pointer hover:bg-gray-200 transition">
          <InsertPhotoIcon />
          Upload Image
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>

        {images.length > 0 && images.map((link) => (
          <div key={link} className="relative w-32 h-32 shadow-md shadow-gray-700 rounded-md overflow-hidden" onMouseEnter={() => setImageHovered(link)} onMouseLeave={() => setImageHovered(null)}>
            <Image src={link} alt="" width={128} height={128} className="object-cover w-full h-full" />
            {imageHovered === link && 
              <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700/50 transition'>
                <button onClick={() => removeImage(link)} className='text-white hover:text-black'>
                  <Delete fontSize='large' />
                </button>
              </div>
            }
          </div>
        ))}

        {isUploading && (
          <div className="w-32 h-32 flex items-center justify-center border-2 border-gray-700 rounded-md">
            <PuffLoader color="#dc2626" speedMultiplier={2} />
          </div>
        )}
      </div>

      <textarea
        placeholder="Description"
        required
        value={description}
        onChange={ev => setDescription(ev.target.value)}
        className="border border-gray-700 rounded-md px-4 py-2 h-32 resize-none"
      />

      <textarea
        placeholder="Meta Title"
        required
        value={metaTitle}
        onChange={ev => setMetaTitle(ev.target.value)}
        className="border border-gray-700 rounded-md px-4 py-2 h-32 resize-none"
      />

      <textarea
        placeholder="Meta Description"
        required
        value={metaDescription}
        onChange={ev => setMetaDescription(ev.target.value)}
        className="border border-gray-700 rounded-md px-4 py-2 h-32 resize-none"
      />

      <button
        type="submit"
        className="bg-black hover:bg-black text-white px-6 py-3 rounded-md self-start mt-8 transition"
      >
        Save Product
      </button>
    </form>
  );
}
