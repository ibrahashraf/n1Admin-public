import Layout from '@/components/Layout'
import { Delete, InsertPhoto } from '@mui/icons-material';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react'
import { PuffLoader } from 'react-spinners';
import Swal from 'sweetalert2';

function Branches() {
  const [branches, setBranches] = useState([]);
  const [activeBranch, setActiveBranch] = useState(null);
  const [newBranch, setNewBranch] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [images, setImages] = useState([]);
  const [imageHovered, setImageHovered] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [id, setId] = useState('');


  useEffect(() => {
    fetchBranches();
  }, []);
  async function fetchBranches()  { 
    await axios.get('/api/branch').then(res => {
    setBranches(res.data);})
  }

  function handleEdit(branch) {
    setActiveBranch(branch);
    setId(branch._id);
    setName(branch.name);
    setAddress(branch.address);
    setImages(branch.images);
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
    setImages(images.filter(img => img !== image));
  }

  async function saveBranch(ev) {
    ev.preventDefault();
    const data = { name, address, images };
    
    if (!name || !address || !images.length) {
      window.alert('Please fill in all fields');
      return;
    }

    if (activeBranch) {
      await axios.put('/api/branch', { ...data, _id: id });
    } else if (newBranch) {
      await axios.post('/api/branch', data);
    }
    setActiveBranch(null);
    setNewBranch(false);
    setName('');
    setAddress('');
    setImages([]);
    fetchBranches();
  }

  function cancelEdit() {
    setActiveBranch(null);
    setNewBranch(false);
    setName('');
    setAddress('');
    setImages([]);
  }

  async function deleteBranch(branch) {
      const res = await Swal.fire({
        title: `Delete "${branch.name}" branch?`,
        showDenyButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "red",
        denyButtonColor: "#000000",
      });
  
      if (res.isConfirmed) {
        const { _id } = branch;
        await axios.delete('/api/branch?_id=' + _id).then(() => {
          fetchBranches();
        });
      }
    } 

  return (
    <Layout>
      <h1>Branches</h1>
      {!activeBranch && !newBranch &&  <button className="btn-primary" onClick={() => setNewBranch(true)}>Create New Branch</button>}
      {activeBranch || newBranch
        ? (
          <form onSubmit={saveBranch} className="flex flex-col gap-6 p-10">
            <input type='text' placeholder='Branch Name' className="border border-gray-700 rounded-md px-3 py-2 w-full" value={name} onChange={(e) => setName(e.target.value)} />
            <input type='text' placeholder='Branch Address' className="border border-gray-700 rounded-md px-3 py-2 w-full" value={address} onChange={(e) => setAddress(e.target.value)} />
            <div className="flex flex-wrap gap-5 items-center">
              <label className="text-sm border-2 border-gray-700 rounded-md flex flex-col gap-2 items-center justify-center h-32 w-32 cursor-pointer hover:bg-gray-200 transition">
                <InsertPhoto />
                Upload Image
                <input type="file" className="hidden" onChange={uploadImages} />
              </label>
              {images.map((link) => (
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
            <div className='flex justify-end gap-4'>
              <button 
                type="button" 
                onClick={() => cancelEdit()} 
                className='btn-secondary'
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                
              >
                Save Branch
              </button>
            </div>
          </form>
        ) 
        : (
          <div>
            {branches.length > 0 && branches.map((branch) => (
              <div className="flex flex-col gap-4 border border-gray-700 rounded-md mt-4 p-4" key={branch._id}>
                <h2 className="font-bold">{branch.name} ({branch.images.length} image{branch.images.length > 1 && 's' })</h2>
                <p className="text-sm text-gray-500">{branch.address}</p>
                <div className="flex gap-2">
                  <button className="btn-primary" onClick={() => handleEdit(branch)}>Edit</button>
                  <button className="btn-secondary" onClick={() => deleteBranch(branch)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </Layout>
  )
}

export default Branches