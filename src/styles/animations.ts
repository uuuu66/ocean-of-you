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
const slideBottomToTopFrames = () => keyframes`
  from {
    transform:translateY(100%);
  }
  to{
    transform:translateY(0%);
  }
`;
const waveFrames = () => keyframes`
  from {
    border-radius: 20% 51% 42% 62%;
    transform-origin: 52% 48%;
    transform: rotate(0deg);
  }
  to{
    border-radius: 20% 51% 42% 62%;
    transform-origin: 52% 48%;
    transform: rotate(360deg);
  }
`;
const golightRightFrames = (fromX: string, toX: string) => keyframes`
    from{
      transform: translateX(${fromX || "-100px"}) rotate(25deg) scaleY(2);
    }
    to{
      transform: translateX(${toX || "100vw"})  rotate(25deg) scaleY(2);
    }
`;
const golightLeftFrames = (fromX: string, toX: string) => keyframes`
    from{
      transform: translateX(${fromX || "100vw"}) rotate(-25deg) scaleY(2);
    }
    to{
      transform: translateX(${toX || "-100px"})  rotate(-25deg) scaleY(2);
    }
`;
const rotateProgressFrames = (shadowColor: string) => keyframes`
  from {
    transform:translate(-50%,50%) rotate(60deg) scaleY(1) ;
    transform-origin: 100% 0%;
  
  }
  to{
    transform:translate(-50%,50%)  rotate(420deg) scaleY(1);  
    transform-origin: 100% 0%;
  }
`;
const rotateFrames = () => keyframes`
  from {
    transform: rotate(0deg) ;
   
  }
  to{
    transform:  rotate(360deg) ;  

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
const tremblingXFrames = () => keyframes`
    0%{
      transform: translate3d(2px,0x,0);
    }50%{
      transform: translate3d(-2px,0px,0);
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

  trembling: css`
    animation-name: ${tremblingFrames};
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
    animation-iteration-count: infinite;
  `,
  tremblingX: css`
    animation-name: ${tremblingXFrames};
    animation-duration: 0.2s;
    animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
    animation-iteration-count: infinite;
  `,
  slideBottomToTop: css`
    animation-name: ${slideBottomToTopFrames()};
    animation-duration: 3s;
    animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
    animation-fill-mode: forwards;
  `,
  wave: css`
    animation-name: ${waveFrames};
    animation-duration: 4s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  `,
  golightRight: css`
    animation-name: ${(props) =>
      golightRightFrames(props.theme.fromX, props.theme.toX)};
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  `,
  golightLeft: css`
    animation-name: ${(props) =>
      golightLeftFrames(props.theme.fromX, props.theme.toX)};
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  `,
  rotateProgress: css`
    animation-name: ${(props) =>
      rotateProgressFrames(props.theme.progressColor)};
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  `,
  rotate: css`
    animation-name: ${rotateFrames};
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    /* animation-iteration-count: infinite; */
  `,
};
export default animations;
