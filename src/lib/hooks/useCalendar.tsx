import { daysInMonth, isSameDate } from "@/lib/utils/date";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";

interface ConstructorArgs {
  date: Date;
  isHoiday?: boolean;
  isSelectdDate?: boolean;
  label?: string;
}
export class DateInfo {
  constructor({ date, isHoiday, label }: ConstructorArgs) {
    this.originDate = date;
    this.day = date.getDay();
    this.date = date.getDate();
    this.month = date.getMonth();
    this.year = date.getFullYear();
    this.isToday = isSameDate(new Date(), date);
    this.isHoliday = isHoiday;
    this.label = label;
  }
  originDate: Date;
  day: number; //요일
  date: number;
  month: number;
  year: number;
  isToday?: boolean;
  isHoliday?: boolean;
  label?: string;
}

export interface UseCalendarProps extends PropsWithChildren {
  defaultDate?: string | Date;
  colMax?: number;
  fillEmptySpacesWithNextMonth?: boolean;
}

const useCalendar = ({
  defaultDate = new Date(),
  colMax = 5,
  fillEmptySpacesWithNextMonth = true,
}: Partial<UseCalendarProps>) => {
  const [selectedDate, setSelectedDate] = useState<DateInfo>(
    new DateInfo({ date: new Date(defaultDate || "") })
  );

  const [days, setDays] = useState<Array<Array<DateInfo>>>([]);

  //년을 지정
  const setYear = (year: number) => {
    const newDate = selectedDate.originDate;
    newDate.setFullYear(year);
    setSelectedDate(new DateInfo({ date: newDate }));
  };

  //월을 지정
  const setMonth = (month: number) => {
    const newDate = selectedDate.originDate;
    newDate.setMonth(month - 1);
    setSelectedDate(new DateInfo({ date: newDate }));
  };
  const gotoNextMonth = () => {
    const nowMonth = selectedDate.month;
    const newDate = new Date(selectedDate.originDate);
    newDate.setMonth(nowMonth + 1);
    setSelectedDate(new DateInfo({ date: newDate }));
  };
  const gotoPrevMonth = () => {
    const nowMonth = selectedDate.month;
    const newDate = new Date(selectedDate.originDate);
    newDate.setMonth(nowMonth - 1);

    setSelectedDate(new DateInfo({ date: newDate }));
  };

  const gotoNextYear = () => {
    setYear(selectedDate.year + 1);
  };
  const gotoPrevYear = () => {
    setYear(selectedDate.year - 1);
  };
  //달력의 ui대로 배열을 만들어주는 함수
  /*
      달력의 모양새
      1   2   3
      8   9   10
      15 16   17
      배열로 가공된 모습
      [1,8,15],[2,9,16],[3,10,17]
    */
  const standardizeDateArrayLengths = useCallback(
    (
      dateInfoArrays: Array<Array<DateInfo>>, //[[],[],[],[],[]]
      seventhDayAtMonth: Partial<DateInfo> = { day: 6 },
      colMax: number = 5
    ) => {
      //달력 한 행의 최대 length 를 구함
      /*
             / /1/2/3/4/5
            6/7/8/9/10/11/12
            13/14/15/16/17/18/19
            20/21/22/23/24/25/26
            27/28/29/30/31/ /
        */
      //최대 length=5 최소 4
      let max = Math.max(
        Math.max(...dateInfoArrays.map((val) => val.length), colMax)
      );

      //7일이 무슨 요일인지 가져옴
      //위 달력 예시에서 7이 월요일인 1이 기 때문에 + 1 한 2행 만큼이 앞 원소가  비어있음= 전 달을 2 일만 보여줌
      const previousMonthDaysToShow = ((seventhDayAtMonth.day || 0) + 1) % 7;
      //반복문에서 쓸 count
      let previousMonthDaysToShowCount = 0;
      //행으로 만듬
      for (let i = 0; i < dateInfoArrays.length; i += 1) {
        const datesOfDays = dateInfoArrays[i];
        const firstDayOfDays = datesOfDays[0];
        //한 행의 마지막날
        let lastDay = datesOfDays[datesOfDays.length - 1];

        //모든 배열이 다 같은 렝스를 가지고 있는 경우가 아닌경우 한줄은 앞을 채워줌
        /*
            29/30/1/2/3 /4 /5
            6/7/8/9/10/11/12
            13/14/15/16/17/18/19
            20/21/22/23/24/25/26
            27/28/29/30/31
        */
        if (previousMonthDaysToShowCount !== previousMonthDaysToShow) {
          const newDate = new Date(firstDayOfDays.originDate);
          newDate.setDate(newDate.getDate() - 7);
          const dateInfo = new DateInfo({
            date: newDate,
          });

          datesOfDays.unshift(dateInfo);
          previousMonthDaysToShowCount += 1;
          max = Math.max(datesOfDays.length, max);
        }
        //모든 배열이 다 같은 렝스를 가지고 있는 경우가 아닌경우 나머지 빈줄은 뒤를 채워줌
        /*
            29/30/1/2/3/4/5
            6/7/8/9/10/11/12
            13/14/15/16/17/18/19
            20/21/22/23/24/25/26
            27/28/29/30/31/1/2
        */
        if (fillEmptySpacesWithNextMonth)
          while (datesOfDays.length < max) {
            const newDate = new Date(lastDay.originDate);
            newDate.setDate(newDate.getDate() + 7);
            const dateInfo = new DateInfo({
              date: newDate,
            });
            datesOfDays.push(dateInfo);
            lastDay = datesOfDays[datesOfDays.length - 1];
          }
        else
          while (datesOfDays.length < max) {
            const firstday = dateInfoArrays[i][0];
            const newDate = new Date(firstday.originDate);
            newDate.setDate(newDate.getDate() - 7);
            const dateInfo = new DateInfo({
              date: newDate,
            });
            datesOfDays.unshift(dateInfo);
          }
      }
      return dateInfoArrays;
    },
    [fillEmptySpacesWithNextMonth]
  );
  //7의 length를 가진 2차원 배열을 생성한 후 Date의 day를 index로 push함
  const makeDateArray = useCallback(() => {
    const newDays: Array<Array<DateInfo>> = [];
    let seventhDayAtMonth: DateInfo | undefined = undefined;
    for (
      let i = 1;
      i <= daysInMonth(selectedDate.month, selectedDate.year);
      i += 1
    ) {
      const newDate = new Date(selectedDate.originDate);
      newDate.setDate(i);
      const dateInfo = new DateInfo({
        date: newDate,
      });
      if (i === 7) seventhDayAtMonth = dateInfo;
      if (!newDays[dateInfo.day]) newDays[dateInfo.day] = [];
      newDays[dateInfo.day].push(dateInfo);
    }
    setDays(standardizeDateArrayLengths(newDays, seventhDayAtMonth, colMax));
  }, [
    colMax,
    standardizeDateArrayLengths,
    selectedDate.month,
    selectedDate.originDate,
    selectedDate.year,
  ]);

  useEffect(() => {
    makeDateArray();
  }, [selectedDate, makeDateArray]);
  return {
    days,
    selectedDate,
    setSelectedDate,
    setYear,
    setMonth,
    gotoNextMonth,
    gotoPrevMonth,
    gotoNextYear,
    gotoPrevYear,
  };
};

export default useCalendar;
