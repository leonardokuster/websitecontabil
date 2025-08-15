'use client';

import * as React from 'react';
import { IMaskInput } from 'react-imask';


const CurrencyMask = React.forwardRef(function CurrencyMask(props, ref) {
  const { onChange, ...other } = props;

  return (
    <IMaskInput
      {...other}
      mask={Number} // Modo numérico
      scale={2} // duas casas decimais
      thousandsSeparator="." // separador de milhar
      radix="," // separador decimal
      normalizeZeros={true}
      padFractionalZeros={true} // mantém as 2 casas mesmo com número inteiro
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
    />
  );
});

export default CurrencyMask;