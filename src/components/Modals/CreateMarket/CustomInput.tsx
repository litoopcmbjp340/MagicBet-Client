import React, { forwardRef } from 'react';
import { Input } from '@chakra-ui/core';

//@ts-ignore
const CustomInput = ({ value, label, onClick, id }, ref) => (
  <Input
    id={id}
    placeholder={label}
    isReadOnly
    value={value}
    onFocus={onClick}
  />
);

export default forwardRef(CustomInput);
