import Layout from "@/components/Layout";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { PuffLoader } from "react-spinners";
import Image from "next/image";
import { Delete } from "@mui/icons-material";

function Categories() {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState(null);
  const [image , setImage] = useState(null);
  const [showOnHome, setShowOnHome] = useState(false);
  const [showOnBanner, setShowOnBanner] = useState(false);
  const [imageHovered, setImageHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    async function fetchProducts()  { 
      await axios.get('/api/Products').then(res => {
      setProducts(res.data);})
    }
    fetchProducts();
  }, []);

  function fetchCategories() {
    axios.get('/api/Categories').then(res => {
      setCategories(res.data);
    });
    setEditedCategory(null);
    setName('');
    setParentCategory(null);
    setImage(null);
    setShowOnHome(false);
    setShowOnBanner(false);
    setMetaTitle('');
    setMetaDescription('');
  }

  

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      image,
      showOnHome,
      showOnBanner,
      metaTitle,
      metaDescription
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/Categories/', data);
    } else {
      await axios.post('/api/Categories', data);
    }
    setName('');
    fetchCategories();
    setParentCategory(null);
    setImage(null);
    setShowOnHome(false);
    setShowOnBanner(false);
    setMetaTitle('');
    setMetaDescription('');
  }

  function removeImage() {
    setImage(null);
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    window.scrollTo(0, 0);
    setParentCategory(category.parentCategory?._id || null);
    setImage(category.image || null);
    setShowOnHome(category.showOnHome || false);
    setShowOnBanner(category.showOnBanner || false);
    setMetaTitle(category.metaTitle || '');
    setMetaDescription(category.metaDescription || '');
  }

  async function uploadImage(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/Upload', data);
      setImage(...res.data.links);
      setIsUploading(false);
    }
  }

  async function deleteCategory(category) {
    const res = await Swal.fire({
      title: `Delete "${category.name}" category?`,
      showDenyButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "red",
      denyButtonColor: "#000000",
    });

    if (res.isConfirmed) {
      const { _id } = category;
      await axios.delete('/api/Categories?_id=' + _id).then(() => {
        fetchCategories();
      });
    }
  } 

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Categories!</h1>

      <h2 className="font-semibold text-black mb-4 px-2">
        {editedCategory ? `Edit category: ${editedCategory.name}` : 'New Category'}
      </h2>

      <form onSubmit={saveCategory} className="mb-8">

        <div className="flex sm:items-center sm:gap-4 max-sm:flex-col max-sm:gap-4">
          <input
            onChange={ev => setName(ev.target.value)}
            value={name}
            type="text"
            placeholder="Category name"
            required
            className="border border-gray-700 px-4 py-2 rounded-md w-full"
          />
          <select
            value={parentCategory || ""}
            onChange={ev => setParentCategory(ev.target.value || null)}
            className="border border-gray-700 px-4 py-2 rounded-md w-full"
          >
            <option value="">None parent category</option>
            {categories.length > 0 && categories.map(category => (
              <option key={category._id} value={category._id}>
                Inside {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          {isUploading ? (
            <div className="w-32 h-32 flex items-center justify-center border-2 border-gray-700 rounded-md">
            <PuffLoader color="#dc2626" speedMultiplier={2} />
            </div>
          ) : image ? (
            <div key={image} className="relative w-32 h-32 shadow-md shadow-gray-700 rounded-md overflow-hidden" onMouseEnter={() => setImageHovered(true)} onMouseLeave={() => setImageHovered(false)}>
              <Image src={image} alt="" width={128} height={128} className="object-cover w-full h-full" />
                {imageHovered && 
                  <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700/50 transition'>
                    <button onClick={() => removeImage()} className='text-white hover:text-black'>
                      <Delete fontSize='large' />
                    </button>
                  </div>
                }
            </div>
          ) : (
            <label className="text-sm border-2 border-gray-700 rounded-md flex flex-col gap-2 items-center justify-center h-32 w-32 cursor-pointer hover:bg-gray-200 transition">
              <InsertPhotoIcon />
              Upload Image
              <input type="file" className="hidden" onChange={uploadImage} />
            </label>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            id="showOnHome"
            type="checkbox"
            className="w-fit"
            checked={showOnHome}
            onChange={ev => setShowOnHome(ev.target.checked)}
          />
          <label htmlFor="showOnHome">Show on home page</label>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <input
            id="showOnBanner"
            type="checkbox"
            className="w-fit"
            checked={showOnBanner}
            onChange={ev => setShowOnBanner(ev.target.checked)}
          />
          <label htmlFor="showOnBanner">Show on banner</label>
        </div>

        <textarea
          onChange={ev => setMetaTitle(ev.target.value)}
          value={metaTitle}
          placeholder="Meta title"
          className="border border-gray-700 px-4 py-2 rounded-md w-full mt-4"
        />

        <textarea
          onChange={ev => setMetaDescription(ev.target.value)}
          value={metaDescription}
          placeholder="Meta description"
          className="border border-gray-700 px-4 py-2 rounded-md w-full mt-4"
        />

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-black hover:bg-black text-white px-6 py-2 rounded-md transition"
          >
            Save
          </button>
          {editedCategory && (
            <button
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory(null);
                setImage(null);
                setShowOnHome(false);
                setShowOnBanner(false);
                setMetaTitle('');
                setMetaDescription('');
              }}
              type="button"
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-gray-700">
          <thead className="bg-gray-700 text-white">
            <tr className="text-left">
              <th className="p-3">Category Name</th>
              <th className="p-3">Parent Category</th>
              <th className="p-3">Actions</th>
              <th className="p-3">Products</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 && categories.map(category => (
              <tr key={category._id} className="border-b border-gray-300 hover:bg-gray-500 transition">
                <td className="p-3">{category.name}</td>
                <td className="p-3">{category?.parentCategory ? category.parentCategory.name : '____'}</td>
                <td className="flex gap-4 items-center p-3">
                  <button onClick={() => editCategory(category)}>
                    <EditNoteIcon
                      sx={{ fontSize: 30 }}
                      className="hover:bg-gray-300 rounded-full p-1 transition"
                    />
                  </button>
                  <button onClick={() => deleteCategory(category)}>
                    <DeleteForeverIcon
                      sx={{ fontSize: 30 }}
                      className="hover:bg-black rounded-full p-1 transition"
                    />
                  </button>
                </td>
                <td className="p-3">
                  {
                    (() => {
                      const categoryId = category._id;
                      const subCategoryIds = categories
                        .filter(cat => cat.parentCategory?._id === categoryId)
                        .map(cat => cat._id);
                      const allCategoryIds = [categoryId, ...subCategoryIds];
                      return products.filter(product => allCategoryIds.includes(product.category)).length;
                    })()
                  } Products
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Categories;
