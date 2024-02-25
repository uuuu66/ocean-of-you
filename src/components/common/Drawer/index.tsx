import Lottie from "lottie-react";
import styled, { css } from "styled-components";
import { lotties } from "../../../../public/lotties";
import { ComponentDirection } from "@/lib/types";

export interface DrawerProps {
  isOpen: boolean;
  drawerDirection: ComponentDirection;
}

const Drawer: React.FC<Partial<DrawerProps>> = ({
  isOpen,
  drawerDirection = "bottom",
}) => {
  return (
    <StyledComponent isOpen={isOpen} drawerDirection={drawerDirection}>
      ddd
    </StyledComponent>
  );
};

export default Drawer;

const StyledComponent = styled.div<Partial<DrawerProps>>`
  background-color: white;
  position: fixed;

  transition: all 0.5s;

  ${({ drawerDirection, isOpen }) => {
    switch (drawerDirection) {
      case "top":
        return css`
          width: 100vw;
          height: 300px;
          top: 0;
          left: 0;
          right: unset;
          bottom: unset;
          transform: ${isOpen ? `translateY(-100%)` : `translateY(0px)`};
        `;
      case "left":
        return css`
          width: 300px;
          height: 100vh;
          top: 0;
          left: 0;
          right: unset;
          bottom: unset;
          transform: ${isOpen ? `translateX(-100%)` : `translateY(0px)`};
        `;
      case "right":
        return css`
          width: 300px;
          height: 100vh;
          top: 0;
          left: unset;
          right: 0;
          bottom: unset;
          transform: ${isOpen ? `translateX(100%)` : `translateY(0px)`};
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.2) 0%,
            rgba(255, 255, 255, 0.9724264705882353) 15%,
            rgba(255, 255, 255, 1) 100%
          );
        `;
      case "bottom":
        return css`
          width: 100vw;
          height: 300px;
          top: unset;
          left: 0;
          right: unset;
          bottom: 0;
          transform: ${isOpen ? `translateY(100%)` : `translateY(0px)`};
        `;
    }
  }}
`;
