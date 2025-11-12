import Layout from "@/components/Layout";
import Link from "next/link";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import axios from "axios";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  useEffect(() => {
    axios.get('/api/Products').then(response => {
      setProducts(response.data);
    });
  }, []);
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);
  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Products</h1>
        <Link
          href={'/Products/New'}
          className="inline-flex items-center gap-2 bg-black hover:bg-black text-white font-semibold py-2 px-6 rounded-md transition mb-8"
        >
          <AddIcon className="p-1" />
          Add New Product
        </Link>
        <input
          type="search"
          placeholder="Search"
          className="border border-gray-300 rounded-md p-2 mb-8"
          onChange={(e) => { setSearchTerm(e.target.value); }}
        />

      <div className="overflow-x-auto mt-6">
        <table className="w-full text-gray-700">
          <thead className="bg-gray-700 text-white">
            <tr className="text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Description</th>
              <th className="p-3">Actions</th>
              <th className="p-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id} className="border-b border-gray-300 hover:bg-gray-500 transition">
                <td className="p-3">{product.title}</td>
                <td className="p-3">{product.description}</td>
                <td className="p-3 flex gap-4">
                  <Link href={'/Products/Edit/' + product._id}>
                    <EditNoteIcon
                      sx={{ fontSize: 28 }}
                      className="text-gray-700 hover:text-white hover:bg-black rounded-full p-1 transition"
                    />
                  </Link>
                  <Link href={'/Products/Delete/' + product._id}>
                    <DeleteForeverIcon
                      sx={{ fontSize: 28 }}
                      className="text-black hover:text-white hover:bg-gray-700 rounded-full p-1 transition"
                    />
                  </Link>
                </td>
                <td className="p-3">
                  {product.variants.map(variant => variant.stock === 0 ? (
                    <p key={variant._id} className="text-black text-xs font-semibold">
                      Out_Of_Stock
                    </p>
                  ) : (
                    <p key={variant._id} className="text-green-600 text-xs font-semibold">
                      In_Stock
                    </p>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
