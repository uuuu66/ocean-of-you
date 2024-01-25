import { theme } from "@/styles/theme";
import { css, keyframes } from "styled-components";

const purseKeyframes = (color: string) => keyframes`
    0% {
        transform: scale(1.0);
    }
    75% { 
        transform: scale(1.05);
        box-shadow: 0px 0px 0px 25px ${color};
    }
    100% {
        transform: scale(1.0);
       
    ;
    }
`;
const purseSecondaryFrames = (color: string) => keyframes`
    0% {
        transform: scale(1.0);
    }
    70% { 
        transform: scale(1.0);
        box-shadow: 0px 0px 0px 10px ${color};
    }
    100% {
        transform: scale(1.0);
    }
    `;
const animations = {
  purse: css`
    animation-name: ${(props) => purseKeyframes(props.theme.purseColor)};
    animation-duration: 1.5s;
    animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  `,
  purseSecondary: css`
    animation-name: ${(props) =>
      purseSecondaryFrames(props.theme.purseSecondaryColor)};
    animation-duration: 1.5s;
    animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  `,
};
export default animations;
