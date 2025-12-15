// utils/formatters.js
export const formatoMoneda = (valor) => {
  const numero = parseFloat(valor || 0);
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(numero);
};