import useCalendar, { UseCalendarProps } from "@/lib/hooks/useCalendar";
import React from "react";

interface Props extends UseCalendarProps {}

const Calendar: React.FC<Props> = (props) => {
  const { days, selectedDate, gotoNextMonth, gotoPrevMonth, setSelectedDate } =
    useCalendar({ colMax: 6, fillEmptySpacesWithNextMonth: true, ...props });
  return (
    <div className="flex flex-col gap-5">
      <div className="w-[300px] flex justify-between">
        <button onClick={gotoPrevMonth}>{`<`}</button>
        {`${selectedDate.year} - ${selectedDate.month + 1}`}
        <button onClick={gotoNextMonth}>{`>`}</button>
      </div>
      <div className="flex w-[300px] justify-between">
        {days.map((array, index) => (
          <div key={index} className="flex flex-col gap-3">
            {array.map((day) => (
              <span
                key={day.year + "-" + day.month + "-" + day.date}
                onClick={() => {
                  setSelectedDate(day);
                }}
              >
                {day.date}
              </span>
            ))}
          </div>
        ))}
      </div>
      {selectedDate.originDate.toUTCString()}
      {` `}
      {selectedDate.originDate.toISOString()}
    </div>
  );
};

export default Calendar;
