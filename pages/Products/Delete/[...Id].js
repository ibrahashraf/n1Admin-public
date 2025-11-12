import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProduct() {
    const router = useRouter();
    const [productInfo, setProductInfo] = useState();
    const {Id} = router.query;
    useEffect(() => {
        if (!Id) {
            return;
        } 
        axios.get('/api/Products?Id='+Id).then(response => {
            setProductInfo(response.data);
        });
    }, [Id]);
    function goBack() {
        router.push('/Products');
    }
    async function deleteProduct() {
        await axios.delete('/api/Products?Id='+Id).then(() => {
            router.push('/Products');
        });
    }
    return (
        <Layout>
            <h1>
                Do you want to delete {productInfo?.title}?
            </h1>
            <div className="flex gap-4">
                <button onClick={deleteProduct} className="btn-primary mt-10">Yes</button>
                <button onClick={goBack} className="btn-secondary mt-10">No</button>
            </div>
        </Layout>
    );
}