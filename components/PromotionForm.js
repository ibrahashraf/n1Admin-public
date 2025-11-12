import axios from 'axios';
import { useEffect, useState } from 'react';
import Select from 'react-select';

export default function PromotionForm({
  state,
  dispatch,
  editedPromotion,
  savePromotion,
  resetForm,
  products,
  categories,
}) {
    const [disabledProducts, setDisabledProducts] = useState([]);
    const [disabledCategories, setDisabledCategories] = useState([]);
    const [hasAll, setHasAll] = useState(false);

    // fetch active promo constraints; exclude the one we're editing so its items stay selectable
    useEffect(() => {
        const url = editedPromotion
            ? `/api/promotions/active?excludeId=${editedPromotion._id}`
            : `/api/promotions/active`;
        axios.get(url).then((res) => {
            const { hasAll, products, categories } = res.data.data || {};
            setHasAll(!!hasAll);
            setDisabledProducts(Array.isArray(products) ? products.map(String) : []);
            setDisabledCategories(Array.isArray(categories) ? categories.map(String) : []);
        });
    }, [editedPromotion]);

    function renderRequiresCodeField() {
        if (!state.requiresCode) return null;
        return (
            <div>
                <div className="mb-4">
                <label className="block mb-2">Promo Code</label>
                <input
                    type="text"
                    value={state.code}
                    onChange={(e) =>
                        dispatch({ type: 'SET_FIELD', field: 'code', value: e.target.value })
                    }
                    placeholder="Enter promo code"
                    required
                    className="border border-gray-700 px-4 py-2 rounded-md w-full"
                />
                </div>
                <div className="mb-4">
                <label className="block mb-2">Usage Limit</label>
                <input
                    type="number"
                    value={state.codeUsageLimit}
                    onChange={(e) =>
                        dispatch({
                            type: 'SET_FIELD',
                            field: 'codeUsageLimit',
                            value: parseInt(e.target.value || '0', 10),
                        })
                    }
                    placeholder="Enter usage limit"
                    required
                    min="0"
                    className="border border-gray-700 px-4 py-2 rounded-md w-full"
                />
                </div>
            </div>
        );
    }

    function renderTriggerSpecificFields() {
        switch (state.promotionType) {
        case 'minSubtotal':
            return (
                <div className="mb-4">
                    <label className="block mb-2">Minimum Subtotal</label>
                    <input
                        type="number"
                        value={state.minSubtotal}
                        onChange={(e) =>
                            dispatch({
                            type: 'SET_FIELD',
                            field: 'minSubtotal',
                            value: parseFloat(e.target.value || '0'),
                            })
                        }
                        placeholder="Enter minimum subtotal"
                        required
                        min="0"
                        step="0.01"
                        className="border border-gray-700 px-4 py-2 rounded-md w-full"
                    />
                </div>
            );
        case 'minQuantity':
            return (
                <div className="mb-4">
                    <label className="block mb-2">Minimum Quantity</label>
                    <input
                        type="number"
                        value={state.minQuantity}
                        onChange={(e) =>
                            dispatch({
                            type: 'SET_FIELD',
                            field: 'minQuantity',
                            value: parseInt(e.target.value || '0', 10),
                            })
                        }
                        placeholder="Enter minimum quantity"
                        required
                        min="1"
                        className="border border-gray-700 px-4 py-2 rounded-md w-full"
                    />
                </div>
            );
        default:
            return null;
        }
    }

    function renderDiscountFields() {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block mb-2">Discount Type</label>
                    <select
                        value={state.discountType}
                        onChange={(e) =>
                            dispatch({ type: 'SET_FIELD', field: 'discountType', value: e.target.value })
                        }
                        className="border border-gray-700 px-4 py-2 rounded-md w-full"
                    >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2">
                        {state.discountType === 'percentage' ? 'Percentage Off' : 'Fixed Amount Off'}
                    </label>
                    <input
                        type="number"
                        value={state.discountValue}
                        onChange={(e) =>
                            dispatch({
                                type: 'SET_FIELD',
                                field: 'discountValue',
                                value:
                                state.discountType === 'percentage'
                                    ? parseInt(e.target.value || '0', 10)
                                    : parseFloat(e.target.value || '0'),
                            })
                        }
                        placeholder={state.discountType === 'percentage' ? '0-100' : 'Amount'}
                        required
                        min="0"
                        max={state.discountType === 'percentage' ? '100' : undefined}
                        step={state.discountType === 'percentage' ? '1' : '0.01'}
                        className="border border-gray-700 px-4 py-2 rounded-md w-full"
                    />
                </div>
            </div>
        );
    }

    function renderAppliesTo() {
        // When hasAll is true (and we're not editing an "all" promo), disable choosing "all"
        const disableAll = hasAll && state.appliesTo !== 'all';
        return (
            <div className="mb-4">
                <label className="block mb-2">Applies To</label>
                <select
                    value={state.appliesTo}
                    onChange={(e) => {
                        const value = e.target.value;
                        // change type + clear selections ONLY when the admin actually changes this
                        dispatch({ type: 'SET_FIELD', field: 'appliesTo', value });
                        dispatch({
                        type: 'RESET_FIELDS',
                        payload: { selectedProducts: [], selectedCategories: [] },
                        });
                    }}
                    className="border border-gray-700 px-4 py-2 rounded-md w-full"
                >
                <option value="all" disabled={disableAll}>All Products</option>
                <option value="products">Specific Products</option>
                <option value="categories">Specific Categories</option>
                </select>
            </div>
        );
    }

    function renderAppliesToFields() {
        if (state.appliesTo === 'all') return null;

        const productOptions = products.map((p) => ({
            value: p._id,
            label: p.title,
            isDisabled: disabledProducts.includes(String(p._id)),
        }));

        const categoryOptions = categories.map((c) => ({
            value: c._id,
            label: c.name,
            isDisabled: disabledCategories.includes(String(c._id)),
        }));

        const options = state.appliesTo === 'products' ? productOptions : categoryOptions;

        const value =
            state.appliesTo === 'products'
                ? (state.selectedProducts || [])
                    .map((id) => options.find((opt) => opt.value === id))
                    .filter(Boolean)
                : (state.selectedCategories || [])
                    .map((id) => options.find((opt) => opt.value === id))
                    .filter(Boolean);

        return (
            <div className="mb-4">
                <label className="block mb-2">
                {state.appliesTo === 'products' ? 'Select Products' : 'Select Categories'}
                </label>
                <Select
                    isMulti
                    options={options}
                    value={value}
                    isOptionDisabled={(option) => option.isDisabled === true}
                    onChange={(selected) => {
                        const values = (selected || []).map((s) => s.value);
                        if (state.appliesTo === 'products') {
                            dispatch({ type: 'SET_FIELD', field: 'selectedProducts', value: values });
                        } else {
                            dispatch({ type: 'SET_FIELD', field: 'selectedCategories', value: values });
                        }
                    }}
                    className="react-select-container"
                    classNamePrefix="react-select"
                />
            </div>
        );
    }

    return (
        <form onSubmit={savePromotion} className="mb-8">
            <div className="grid grid-cols-1 gap-4 mb-4">
                <div className='flex items-center gap-2'>
                    <label className="block" htmlFor="requiresCode">Requires Promo Code</label>
                    <input
                        type="checkbox"
                        checked={state.requiresCode}
                        onChange={(e) =>
                            dispatch({ type: 'SET_FIELD', field: 'requiresCode', value: e.target.checked })
                        }
                        id="requiresCode"
                        className=" w-fit"
                    />
                </div>

                {renderRequiresCodeField()}

                <div>
                    <label className="block mb-2">Promotion Type</label>
                    <select
                        value={state.promotionType}
                        onChange={(e) => {
                            const value = e.target.value;
                            dispatch({ type: 'SET_FIELD', field: 'promotionType', value });
                            // reset fields tied to type when changed by the admin
                            dispatch({
                                type: 'RESET_FIELDS',
                                payload: {
                                minSubtotal: 0,
                                minQuantity: 0,
                                appliesTo: state.appliesTo, // keep current appliesTo
                                // keep selections; they'll be cleared only when appliesTo changes
                                },
                            });
                        }}
                        className="border border-gray-700 px-4 py-2 rounded-md w-full"
                    >
                        <option value="auto">Automatic</option>
                        <option value="minSubtotal">Minimum Subtotal</option>
                        <option value="minQuantity">Minimum Quantity</option>
                    </select>
                </div>

                <div>
                <label className="block mb-2">Title</label>
                <input
                    type="text"
                    value={state.title}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'title', value: e.target.value })}
                    placeholder="Promotion title"
                    required
                    className="border border-gray-700 px-4 py-2 rounded-md w-full"
                />
                </div>

                <div>
                <label className="block mb-2">Description</label>
                <textarea
                    value={state.description}
                    onChange={(e) =>
                        dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })
                    }
                    placeholder="Promotion description"
                    className="border border-gray-700 px-4 py-2 rounded-md w-full"
                />
                </div>
            </div>

            {renderTriggerSpecificFields()}
            {renderAppliesTo()}
            {renderAppliesToFields()}
            {renderDiscountFields()}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block mb-2">Start Date/Time</label>
                    <input
                        type="datetime-local"
                        value={state.startsAt}
                        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'startsAt', value: e.target.value })}
                        className="border border-gray-700 px-4 py-2 rounded-md w-full"
                    />
                </div>
                <div>
                    <label className="block mb-2">End Date/Time</label>
                    <input
                        type="datetime-local"
                        value={state.endsAt}
                        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'endsAt', value: e.target.value })}
                        className="border border-gray-700 px-4 py-2 rounded-md w-full"
                    />
                </div>
            </div>

            <div className="flex items-center mb-6">
                <input
                    type="checkbox"
                    checked={state.showOnHome}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'showOnHome', value: e.target.checked })}
                    id="showOnHome"
                    className="mr-2 w-fit"
                />
                <label htmlFor="showOnHome">Show on home</label>
            </div>

            <div className="flex items-center mb-6">
                <input
                    type="checkbox"
                    checked={state.showTime}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'showTime', value: e.target.checked })}
                    id="showTime"
                    className="mr-2 w-fit"
                />
                <label htmlFor="showTime">Show time</label>
            </div>

            <div className="flex items-center mb-6">
                <input
                    type="checkbox"
                    checked={state.isActive}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'isActive', value: e.target.checked })}
                    id="isActive"
                    className="mr-2 w-fit"
                />
                <label htmlFor="isActive">Active</label>
            </div>

            <div className="flex gap-4">
                <button type="submit" className="bg-black hover:bg-black text-white px-6 py-2 rounded-md transition">
                    Save
                </button>
                {editedPromotion && (
                    <button
                        onClick={resetForm}
                        type="button"
                        className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md transition"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
