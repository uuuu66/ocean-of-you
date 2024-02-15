import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
interface DropdownContextValue {
  isOpen: boolean;
  selectedValue: string;
  handleChangeValue: (value: string) => void;
  handleClickTrigger: () => void;
}
interface Props extends PropsWithChildren {
  value: string;
  defaultOpen: boolean;
  onChange: (value: string) => void;
}
const DropdownContext = createContext<DropdownContextValue | null>(null);

const Dropdown: React.FC<Partial<Props>> = ({
  value,
  defaultOpen,
  onChange,
  children,
}) => {
  const isMount = useRef<boolean>(false);
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false);
  const [selectedValue, setSelectedValue] = useState(value ?? "");
  const handleClickTrigger = () => {
    setIsOpen(!isOpen);
  };
  const handleChangeValue = (value: string) => {
    if (onChange) onChange(value);
    setSelectedValue(value);
    setIsOpen(false);
  };
  useEffect(() => {
    if (!isMount.current) {
      if (value) setSelectedValue(value);
      isMount.current = true;
    }
  }, [value]);
  return (
    <DropdownContext.Provider
      value={{ selectedValue, isOpen, handleClickTrigger, handleChangeValue }}
    >
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (context === null) {
    throw new Error(
      "useDropdownContext must be used within a DropdownProvider"
    );
  }
  return context;
};
export default Dropdown;
