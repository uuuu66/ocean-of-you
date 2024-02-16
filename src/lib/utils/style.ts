import { theme } from "@/styles/theme";
import { ComponentType } from "@/lib/types";
type Booleanish = boolean | "true" | "false";
import {
  AnimationEventHandler,
  AriaRole,
  CSSProperties,
  ClipboardEventHandler,
  CompositionEventHandler,
  DragEventHandler,
  FocusEventHandler,
  FormEventHandler,
  HTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  PointerEventHandler,
  ReactEventHandler,
  ReactNode,
  TouchEventHandler,
  TransitionEventHandler,
  UIEventHandler,
  WheelEventHandler,
} from "react";
import { onlyLowerCase } from "@/lib/utils/string";
export const getComponentTypeColor = (
  ComponentType?: ComponentType,
  stage: number = 0
) => {
  switch (ComponentType) {
    case "primary":
      return theme.colors.primaries[stage];
    case "secondary":
      return theme.colors.secondaries[stage];
    case "green":
      return theme.colors.greens[stage];
    case "red":
      return theme.colors.reds[stage];
    case "gray":
    default:
      return theme.colors.grays[stage];
  }
};
class HTMLAttributeClass<T> {
  // React-specific Attributes
  defaultChecked?: boolean | undefined;
  defaultValue?: string | number | readonly string[] | undefined;
  suppressContentEditableWarning?: boolean | undefined;
  suppressHydrationWarning?: boolean | undefined;

  // Standard HTML Attributes
  accessKey?: string | undefined;
  autoFocus?: boolean | undefined;
  className?: string | undefined;
  contentEditable?: Booleanish | "inherit" | "plaintext-only" | undefined;
  contextMenu?: string | undefined;
  dir?: string | undefined;
  draggable?: Booleanish | undefined;
  hidden?: boolean | undefined;
  id?: string | undefined;
  lang?: string | undefined;
  nonce?: string | undefined;
  slot?: string | undefined;
  spellCheck?: Booleanish | undefined;
  style?: CSSProperties | undefined;
  tabIndex?: number | undefined;
  title?: string | undefined;
  translate?: "yes" | "no" | undefined;

  // Unknown
  radioGroup?: string | undefined; // <command>, <menuitem>

  // WAI-ARIA
  role?: AriaRole | undefined;

  // RDFa Attributes
  about?: string | undefined;
  content?: string | undefined;
  datatype?: string | undefined;
  inlist?: any;
  prefix?: string | undefined;
  property?: string | undefined;
  rel?: string | undefined;
  resource?: string | undefined;
  rev?: string | undefined;
  typeof?: string | undefined;
  vocab?: string | undefined;

  // Non-standard Attributes
  autoCapitalize?: string | undefined;
  autoCorrect?: string | undefined;
  autoSave?: string | undefined;
  color?: string | undefined;
  itemProp?: string | undefined;
  itemScope?: boolean | undefined;
  itemType?: string | undefined;
  itemID?: string | undefined;
  itemRef?: string | undefined;
  results?: number | undefined;
  security?: string | undefined;
  unselectable?: "on" | "off" | undefined;

  // Living Standard
  /**
   * Hints at the type of data that might be entered by the user while editing the element or its contents
   * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
   */
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search"
    | undefined;
  /**
   * Specify that a standard HTML element should behave like a defined custom built-in element
   * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
   */
  is?: string | undefined;

  // Clipboard Events
  onCopy?: ClipboardEventHandler<T> | undefined;
  onCopyCapture?: ClipboardEventHandler<T> | undefined;
  onCut?: ClipboardEventHandler<T> | undefined;
  onCutCapture?: ClipboardEventHandler<T> | undefined;
  onPaste?: ClipboardEventHandler<T> | undefined;
  onPasteCapture?: ClipboardEventHandler<T> | undefined;

  // Composition Events
  onCompositionEnd?: CompositionEventHandler<T> | undefined;
  onCompositionEndCapture?: CompositionEventHandler<T> | undefined;
  onCompositionStart?: CompositionEventHandler<T> | undefined;
  onCompositionStartCapture?: CompositionEventHandler<T> | undefined;
  onCompositionUpdate?: CompositionEventHandler<T> | undefined;
  onCompositionUpdateCapture?: CompositionEventHandler<T> | undefined;

  // Focus Events
  onFocus?: FocusEventHandler<T> | undefined;
  onFocusCapture?: FocusEventHandler<T> | undefined;
  onBlur?: FocusEventHandler<T> | undefined;
  onBlurCapture?: FocusEventHandler<T> | undefined;

  // Form Events
  onChange?: FormEventHandler<T> | undefined;
  onChangeCapture?: FormEventHandler<T> | undefined;
  onBeforeInput?: FormEventHandler<T> | undefined;
  onBeforeInputCapture?: FormEventHandler<T> | undefined;
  onInput?: FormEventHandler<T> | undefined;
  onInputCapture?: FormEventHandler<T> | undefined;
  onReset?: FormEventHandler<T> | undefined;
  onResetCapture?: FormEventHandler<T> | undefined;
  onSubmit?: FormEventHandler<T> | undefined;
  onSubmitCapture?: FormEventHandler<T> | undefined;
  onInvalid?: FormEventHandler<T> | undefined;
  onInvalidCapture?: FormEventHandler<T> | undefined;

  // Image Events
  onLoad?: ReactEventHandler<T> | undefined;
  onLoadCapture?: ReactEventHandler<T> | undefined;
  onError?: ReactEventHandler<T> | undefined; // also a Media Event
  onErrorCapture?: ReactEventHandler<T> | undefined; // also a Media Event

  // Keyboard Events
  onKeyDown?: KeyboardEventHandler<T> | undefined;
  onKeyDownCapture?: KeyboardEventHandler<T> | undefined;
  /** @deprecated */
  onKeyPress?: KeyboardEventHandler<T> | undefined;
  /** @deprecated */
  onKeyPressCapture?: KeyboardEventHandler<T> | undefined;
  onKeyUp?: KeyboardEventHandler<T> | undefined;
  onKeyUpCapture?: KeyboardEventHandler<T> | undefined;

  // Media Events
  onAbort?: ReactEventHandler<T> | undefined;
  onAbortCapture?: ReactEventHandler<T> | undefined;
  onCanPlay?: ReactEventHandler<T> | undefined;
  onCanPlayCapture?: ReactEventHandler<T> | undefined;
  onCanPlayThrough?: ReactEventHandler<T> | undefined;
  onCanPlayThroughCapture?: ReactEventHandler<T> | undefined;
  onDurationChange?: ReactEventHandler<T> | undefined;
  onDurationChangeCapture?: ReactEventHandler<T> | undefined;
  onEmptied?: ReactEventHandler<T> | undefined;
  onEmptiedCapture?: ReactEventHandler<T> | undefined;
  onEncrypted?: ReactEventHandler<T> | undefined;
  onEncryptedCapture?: ReactEventHandler<T> | undefined;
  onEnded?: ReactEventHandler<T> | undefined;
  onEndedCapture?: ReactEventHandler<T> | undefined;
  onLoadedData?: ReactEventHandler<T> | undefined;
  onLoadedDataCapture?: ReactEventHandler<T> | undefined;
  onLoadedMetadata?: ReactEventHandler<T> | undefined;
  onLoadedMetadataCapture?: ReactEventHandler<T> | undefined;
  onLoadStart?: ReactEventHandler<T> | undefined;
  onLoadStartCapture?: ReactEventHandler<T> | undefined;
  onPause?: ReactEventHandler<T> | undefined;
  onPauseCapture?: ReactEventHandler<T> | undefined;
  onPlay?: ReactEventHandler<T> | undefined;
  onPlayCapture?: ReactEventHandler<T> | undefined;
  onPlaying?: ReactEventHandler<T> | undefined;
  onPlayingCapture?: ReactEventHandler<T> | undefined;
  onProgress?: ReactEventHandler<T> | undefined;
  onProgressCapture?: ReactEventHandler<T> | undefined;
  onRateChange?: ReactEventHandler<T> | undefined;
  onRateChangeCapture?: ReactEventHandler<T> | undefined;
  onResize?: ReactEventHandler<T> | undefined;
  onResizeCapture?: ReactEventHandler<T> | undefined;
  onSeeked?: ReactEventHandler<T> | undefined;
  onSeekedCapture?: ReactEventHandler<T> | undefined;
  onSeeking?: ReactEventHandler<T> | undefined;
  onSeekingCapture?: ReactEventHandler<T> | undefined;
  onStalled?: ReactEventHandler<T> | undefined;
  onStalledCapture?: ReactEventHandler<T> | undefined;
  onSuspend?: ReactEventHandler<T> | undefined;
  onSuspendCapture?: ReactEventHandler<T> | undefined;
  onTimeUpdate?: ReactEventHandler<T> | undefined;
  onTimeUpdateCapture?: ReactEventHandler<T> | undefined;
  onVolumeChange?: ReactEventHandler<T> | undefined;
  onVolumeChangeCapture?: ReactEventHandler<T> | undefined;
  onWaiting?: ReactEventHandler<T> | undefined;
  onWaitingCapture?: ReactEventHandler<T> | undefined;

  // MouseEvents
  onAuxClick?: MouseEventHandler<T> | undefined;
  onAuxClickCapture?: MouseEventHandler<T> | undefined;
  onClick?: MouseEventHandler<T> | undefined;
  onClickCapture?: MouseEventHandler<T> | undefined;
  onContextMenu?: MouseEventHandler<T> | undefined;
  onContextMenuCapture?: MouseEventHandler<T> | undefined;
  onDoubleClick?: MouseEventHandler<T> | undefined;
  onDoubleClickCapture?: MouseEventHandler<T> | undefined;
  onDrag?: DragEventHandler<T> | undefined;
  onDragCapture?: DragEventHandler<T> | undefined;
  onDragEnd?: DragEventHandler<T> | undefined;
  onDragEndCapture?: DragEventHandler<T> | undefined;
  onDragEnter?: DragEventHandler<T> | undefined;
  onDragEnterCapture?: DragEventHandler<T> | undefined;
  onDragExit?: DragEventHandler<T> | undefined;
  onDragExitCapture?: DragEventHandler<T> | undefined;
  onDragLeave?: DragEventHandler<T> | undefined;
  onDragLeaveCapture?: DragEventHandler<T> | undefined;
  onDragOver?: DragEventHandler<T> | undefined;
  onDragOverCapture?: DragEventHandler<T> | undefined;
  onDragStart?: DragEventHandler<T> | undefined;
  onDragStartCapture?: DragEventHandler<T> | undefined;
  onDrop?: DragEventHandler<T> | undefined;
  onDropCapture?: DragEventHandler<T> | undefined;
  onMouseDown?: MouseEventHandler<T> | undefined;
  onMouseDownCapture?: MouseEventHandler<T> | undefined;
  onMouseEnter?: MouseEventHandler<T> | undefined;
  onMouseLeave?: MouseEventHandler<T> | undefined;
  onMouseMove?: MouseEventHandler<T> | undefined;
  onMouseMoveCapture?: MouseEventHandler<T> | undefined;
  onMouseOut?: MouseEventHandler<T> | undefined;
  onMouseOutCapture?: MouseEventHandler<T> | undefined;
  onMouseOver?: MouseEventHandler<T> | undefined;
  onMouseOverCapture?: MouseEventHandler<T> | undefined;
  onMouseUp?: MouseEventHandler<T> | undefined;
  onMouseUpCapture?: MouseEventHandler<T> | undefined;

  // Selection Events
  onSelect?: ReactEventHandler<T> | undefined;
  onSelectCapture?: ReactEventHandler<T> | undefined;

  // Touch Events
  onTouchCancel?: TouchEventHandler<T> | undefined;
  onTouchCancelCapture?: TouchEventHandler<T> | undefined;
  onTouchEnd?: TouchEventHandler<T> | undefined;
  onTouchEndCapture?: TouchEventHandler<T> | undefined;
  onTouchMove?: TouchEventHandler<T> | undefined;
  onTouchMoveCapture?: TouchEventHandler<T> | undefined;
  onTouchStart?: TouchEventHandler<T> | undefined;
  onTouchStartCapture?: TouchEventHandler<T> | undefined;

  // Pointer Events
  onPointerDown?: PointerEventHandler<T> | undefined;
  onPointerDownCapture?: PointerEventHandler<T> | undefined;
  onPointerMove?: PointerEventHandler<T> | undefined;
  onPointerMoveCapture?: PointerEventHandler<T> | undefined;
  onPointerUp?: PointerEventHandler<T> | undefined;
  onPointerUpCapture?: PointerEventHandler<T> | undefined;
  onPointerCancel?: PointerEventHandler<T> | undefined;
  onPointerCancelCapture?: PointerEventHandler<T> | undefined;
  onPointerEnter?: PointerEventHandler<T> | undefined;
  onPointerEnterCapture?: PointerEventHandler<T> | undefined;
  onPointerLeave?: PointerEventHandler<T> | undefined;
  onPointerLeaveCapture?: PointerEventHandler<T> | undefined;
  onPointerOver?: PointerEventHandler<T> | undefined;
  onPointerOverCapture?: PointerEventHandler<T> | undefined;
  onPointerOut?: PointerEventHandler<T> | undefined;
  onPointerOutCapture?: PointerEventHandler<T> | undefined;
  onGotPointerCapture?: PointerEventHandler<T> | undefined;
  onGotPointerCaptureCapture?: PointerEventHandler<T> | undefined;
  onLostPointerCapture?: PointerEventHandler<T> | undefined;
  onLostPointerCaptureCapture?: PointerEventHandler<T> | undefined;

  // UI Events
  onScroll?: UIEventHandler<T> | undefined;
  onScrollCapture?: UIEventHandler<T> | undefined;

  // Wheel Events
  onWheel?: WheelEventHandler<T> | undefined;
  onWheelCapture?: WheelEventHandler<T> | undefined;

  // Animation Events
  onAnimationStart?: AnimationEventHandler<T> | undefined;
  onAnimationStartCapture?: AnimationEventHandler<T> | undefined;
  onAnimationEnd?: AnimationEventHandler<T> | undefined;
  onAnimationEndCapture?: AnimationEventHandler<T> | undefined;
  onAnimationIteration?: AnimationEventHandler<T> | undefined;
  onAnimationIterationCapture?: AnimationEventHandler<T> | undefined;
  // Transition Events
  onTransitionEnd?: TransitionEventHandler<T> | undefined;
  onTransitionEndCapture?: TransitionEventHandler<T> | undefined;
}
export const shouldForwardProp = (text: string) => {
  const attribute = new HTMLAttributeClass();
  const keys = Object.keys(attribute);
  if (keys.includes(text)) return true;
  else return onlyLowerCase(text);
};
