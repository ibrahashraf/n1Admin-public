import React from 'react'
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function PromotionTable({promotions, editPromotion, deletePromotion}) {


  function formatPromotionDetails(promotion) {
    let details = [];
    // requiresCode details
    if (promotion.requiresCode) {
      details.push(`Code: ${promotion.code} (Limit: ${promotion.codeUsageLimit})`);
    }
    
    // promotionType details
    switch (promotion.promotionType) {
      case 'auto':
        details.push('Automatic');
        break;
      case 'minSubtotal':
        details.push(`Min Subtotal: $${promotion.minSubtotal}`);
        break;
      case 'minQuantity':
        details.push(`Min Quantity: ${promotion.minQuantity}`);
        break;
    }
    
    // Discount details
    if (promotion.discountType === 'percentage') {
      details.push(`Discount: ${promotion.discountValue}%`);
    } else if (promotion.discountType === 'fixed') {
      details.push(`Discount: $${promotion.discountValue}`);
    }
    // Applies to
    if (promotion.appliesTo === 'products' && promotion.products?.length > 0) {
      details.push(`Products: ${promotion.products.length}`);
    } else if (promotion.appliesTo === 'categories' && promotion.categories?.length > 0) {
      details.push(`Categories: ${promotion.categories.length}`);
    }
    
    // Dates
    if (promotion.startsAt || promotion.endsAt) {
      const start = promotion.startsAt ? new Date(promotion.startsAt).toLocaleDateString() : 'Now';
      const end = promotion.endsAt ? new Date(promotion.endsAt).toLocaleDateString() : 'No end';
      details.push(`Active: ${start} - ${end}`);
    }
    
    return details.join(' | ');
  }
  return (
      <table className="w-full text-gray-700">
          <thead className="bg-gray-700 text-white">
            <tr className="text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Details</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.length > 0 ? (
              promotions.map(promotion => (
                <tr key={promotion._id} className="border-b border-gray-300 hover:bg-gray-500 transition">
                  <td className="p-3 font-medium">{promotion.title}</td>
                  <td className="p-3 text-sm">{formatPromotionDetails(promotion)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${promotion.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {promotion.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="flex gap-4 items-center p-3">
                    <button onClick={() => editPromotion(promotion)}>
                      <EditNoteIcon
                        sx={{ fontSize: 30 }}
                        className="hover:bg-gray-300 rounded-full p-1 transition"
                      />
                    </button>
                    <button onClick={() => deletePromotion(promotion)}>
                      <DeleteForeverIcon
                        sx={{ fontSize: 30 }}
                        className="hover:bg-black rounded-full p-1 transition"
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center">No promotions found</td>
              </tr>
            )}
          </tbody>
        </table>
  )
}
