import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProduct() {
    const [productInfo, setProductInfo] = useState(null)
    const router = useRouter();
    const {Id} = router.query;
    useEffect(() => {
        if (!Id) {
            return;
        };
        axios.get('/api/Products?Id='+Id).then(response => {
            setProductInfo(response.data);
        });
    }, [Id]);
    return (
        <Layout>
            <h1>
                Edit product
            </h1>
            {productInfo && <>
                <ProductForm {...productInfo} />
            </>}
            
        </Layout>
    );
};