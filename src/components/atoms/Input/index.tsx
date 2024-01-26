import React, { HTMLAttributes, InputHTMLAttributes } from "react";
import styled from "styled-components";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ children, ...props }) => {
  return (
    <div className="relative float-left">
      <label />
      <StyledComponent {...props} />
      <AnimationComponent className="amimation-component" />
    </div>
  );
};

export default Input;

const StyledComponent = styled.input``;
const AnimationComponent = styled.span`
  position: absolute;
  width: 0px;
  height: 0px;
  bottom: 0;
  &::after {
    content: "";
    position: absolute;
    top: -1px;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: #3399ff;
    transition: 0.4s;
  }
  &::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: #3399ff;
    transition: 0.4s;
  }
`;
