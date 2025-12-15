// components/ventas/ProductSearch.jsx
import React from 'react';

const ProductSearch = ({ query, onSearch }) => {
  return (
    <div className="mb-3">
      <input 
        type="text" 
        className="form-control form-control-lg border-primary shadow-sm" 
        placeholder="🔍 Buscar por nombre o SKU (código)..." 
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        autoFocus
      />
    </div>
  );
};

export default ProductSearch;