import { theme } from "@/styles/theme";
import { css, keyframes } from "styled-components";

const purseframes = (
  color: string,
  purseBlurLength?: string,
  purseSpreadLength?: string,
  purseScale?: number
) => keyframes`
    0% {
        transform: scale(1.0);
    }
    75% { 
        transform: scale(${purseScale || 1.05});
        box-shadow: 0px 0px ${purseBlurLength || "0px"} ${
  purseSpreadLength || "25px"
} ${color};
    }
    100% {
        transform: scale(1.0);
    ;
    }
`;
const fillBottomToTopFrames = () => keyframes`
  from {
    transform:translateY(100%);

  }
  to{
    transform:translateY(0%);
  }
`;
const tremblingFrames = () => keyframes`
    0%{
        transform: translate3d(1px,1x,0);
    }25%{
      transform: translate3d(-1px,-1px,0);
    }50%{
      transform: translate3d(-1px,1px,0);
    }
    75%{
      transform: translate3d(1px,-1px,0);
    }100%{
      transform: translate3d(1px,1px,0);
    }
    `;
const animations = {
  purse: css`
    animation-name: ${(props) =>
      purseframes(
        props.theme.purseColor,
        props.theme.purseBlurLength,
        props.theme.purseSpreadLength,
        props.theme.purseScale
      )};
    animation-duration: 1.5s;
    animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  `,
  purseSecondary: css`
    animation-name: ${(props) =>
      purseframes(
        props.theme.purseSecondaryColor,
        props.theme.purseBlurLength,
        props.theme.purseSpreadLength,
        props.theme.purseScale
      )};
    animation-duration: 1.5s;
    animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  `,

  trembling: css`
    animation-name: ${tremblingFrames};
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
    animation-iteration-count: infinite;
  `,
  fillBottomToTopFrames: css`
    animation-name: ${fillBottomToTopFrames()};
    animation-duration: 3s;
    animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
    animation-fill-mode: forwards;
  `,
};
export default animations;
