import { theme } from "@/styles/theme";
import { useMemo } from "react";
import "../app/globals.css";
interface Props {}

const Colors: React.FC<Props> = (props) => {
  const colors = useMemo(() => {
    return Object.entries(theme.colors);
  }, []);
  return (
    <div className="flex flex-col gap-3">
      {colors.map((color) => {
        return (
          <div
            key={color[0]}
            className="flex flex-row items-center flex-nowrap gap-2"
          >
            <div className="">
              <span>{color[0]}</span>
            </div>
            <div
              className="flex items-center  p-3 h-2 shadow-2xl border border-solid border-gray3"
              style={{
                backgroundColor:
                  typeof color?.[1] === "string"
                    ? color?.[1] || "black"
                    : "black",
              }}
            >
              {color[1]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Colors;
