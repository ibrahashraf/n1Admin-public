import Layout from "@/components/Layout";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useReducer, useState } from "react";
import PromotionTable from "@/components/PromotionTable";
import PromotionForm from "@/components/PromotionForm";

function toLocalInputValue(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    const tzOffset = d.getTimezoneOffset(); // minutes
    const local = new Date(d.getTime() - tzOffset * 60000);
    return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
}

export default function PromotionsPage() {
  const [editedPromotion, setEditedPromotion] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const initialState = {
    title: "",
    description: "",
    requiresCode: false,
    code: "",
    codeUsageLimit: 0,
    promotionType: "auto",
    minSubtotal: 0,
    minQuantity: 0,
    appliesTo: "all",
    selectedProducts: [],
    selectedCategories: [],
    discountType: "percentage",
    discountValue: 0,
    startsAt: "",
    endsAt: "",
    showOnHome: true,
    showTime: true,
    isActive: true,
  };

  function formReducer(state, action) {
    switch (action.type) {
      case "SET_FIELD":
        return { ...state, [action.field]: action.value };

      case "RESET":
        return { ...initialState };

      case "LOAD_PROMOTION": {
        const p = action.payload || {};
        return {
          ...state,
          title: p.title || "",
          description: p.description || "",
          requiresCode: !!p.requiresCode,
          code: p.code || "",
          codeUsageLimit: p.codeUsageLimit || 0,
          promotionType: p.promotionType || "auto",
          minSubtotal: p.minSubtotal || 0,
          minQuantity: p.minQuantity || 0,
          appliesTo: p.appliesTo || "all",
          selectedProducts: Array.isArray(p.products) ? p.products.map(String) : [],
          selectedCategories: Array.isArray(p.categories) ? p.categories.map(String) : [],
          discountType: p.discountType || "percentage",
          discountValue: typeof p.discountValue === "number" ? p.discountValue : Number(p.discountValue || 0),
          startsAt: toLocalInputValue(p.startsAt),
          endsAt: toLocalInputValue(p.endsAt),
          showOnHome: !!p.showOnHome,
          showTime: !!p.showTime,
          isActive: p.isActive !== undefined ? !!p.isActive : true,
        };
      }

      case "RESET_FIELDS":
        return { ...state, ...action.payload };

      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(formReducer, initialState);

  // NOTE: we removed the "reset on type/appliesTo" effects to avoid wiping data during edit.
  // Resets are now triggered only in the Form when the admin changes those selects.

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchPromotions() {
    const res = await axios.get("/api/promotions");
    setPromotions(res.data);
    resetForm();
  }

  async function fetchProducts() {
    const res = await axios.get("/api/Products");
    setProducts(res.data);
  }

  async function fetchCategories() {
    const res = await axios.get("/api/Categories");
    setCategories(res.data);
  }

  function resetForm() {
    setEditedPromotion(null);
    dispatch({ type: "RESET" });
    window.scrollTo(0, 0);
  }

  async function savePromotion(ev) {
    ev.preventDefault();

    const data = {
      title: state.title,
      description: state.description,
      requiresCode: state.requiresCode,
      promotionType: state.promotionType,
      isActive: state.isActive,
      showOnHome: state.showOnHome,
      showTime: state.showTime,
      discountType: state.discountType,
      discountValue: state.discountValue,
      appliesTo: state.appliesTo,
      ...(state.requiresCode && { code: state.code, codeUsageLimit: state.codeUsageLimit }),
      ...(state.promotionType === "minSubtotal" && { minSubtotal: state.minSubtotal }),
      ...(state.promotionType === "minQuantity" && { minQuantity: state.minQuantity }),
      ...(state.appliesTo === "products" && { products: state.selectedProducts }),
      ...(state.appliesTo === "categories" && { categories: state.selectedCategories }),
      ...(state.startsAt && { startsAt: state.startsAt }),
      ...(state.endsAt && { endsAt: state.endsAt }),
    };

    try {
      if (editedPromotion) {
        await axios.put("/api/promotions", { _id: editedPromotion._id, ...data });
      } else {
        await axios.post("/api/promotions", data);
      }
      await fetchPromotions();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.error || "Failed to save promotion",
        icon: "error",
      });
    } finally {
      window.location.reload();
    }
  }

  function editPromotion(promotion) {
    setEditedPromotion(promotion);
    dispatch({
      type: "LOAD_PROMOTION",
      payload: promotion,
    });
    window.scrollTo(0, 0);
  }

  async function deletePromotion(promotion) {
    const res = await Swal.fire({
      title: `Delete "${promotion.title}" promotion?`,
      showDenyButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "red",
      denyButtonColor: "#000000",
    });

    if (res.isConfirmed) {
      await axios.delete("/api/promotions?id=" + promotion._id);
      fetchPromotions();
    }
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Promotions</h1>

      <h2 className="font-semibold text-black mb-4 px-2">
        {editedPromotion ? `Edit promotion: ${editedPromotion.title}` : "New Promotion"}
      </h2>

      <PromotionForm
        state={state}
        dispatch={dispatch}
        editedPromotion={editedPromotion}
        savePromotion={savePromotion}
        resetForm={resetForm}
        products={products}
        categories={categories}
      />

      <div className="overflow-x-auto">
        <PromotionTable
          promotions={promotions}
          editPromotion={editPromotion}
          deletePromotion={deletePromotion}
        />
      </div>
    </Layout>
  );
}
