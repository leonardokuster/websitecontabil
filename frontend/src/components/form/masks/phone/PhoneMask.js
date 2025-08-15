'use client';

import * as React from 'react';
import { IMaskInput } from 'react-imask';


const PhoneMask = React.forwardRef(function PhoneMask(props, ref) {
  const { onChange, ...other } = props;

  const masks = [
    { mask: '(00) 0000-0000' }, // Máscara para 8 dígitos
    { mask: '(00) 00000-0000' } // Máscara para 9 dígitos
  ];

  return (
    <IMaskInput
      {...other}
      mask={masks}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

export default PhoneMask;