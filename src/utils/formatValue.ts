const formatValue = (value: number): string =>
  Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value,
  ); // Formatando velor para moeda pt-br Real

export default formatValue;
