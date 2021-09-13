import React from 'react';

export const navigationRef = React.createRef();

export const navigate = (name, params) => {
  navigationRef.current && navigationRef.current.navigate(name, params);
}