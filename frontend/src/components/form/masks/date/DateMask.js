'use client';

import * as React from 'react';
import { IMaskInput } from 'react-imask';


const DateMask = React.forwardRef(function DateMask(props, ref) {
  const { onChange, ...other } = props;

  return (
    <IMaskInput
      {...other}
      mask='00/00/0000'
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      placeholder='DD/MM/AAAA'
    />
  );
});

export default DateMask;