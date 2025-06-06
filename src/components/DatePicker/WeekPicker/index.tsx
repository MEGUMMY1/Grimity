import { subDays, isToday, isBefore, startOfDay } from "date-fns";

import Icon from "@/components/Asset/IconTemp";
import Button from "@/components/Button/Button";
import useDateNavigation from "@/hooks/useDateNavigation";

import { formattedDate } from "@/utils/formatDate";

import styles from "@/components/DatePicker/DatePicker.module.scss";

interface WeekPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

function WeekPicker({ selectedDate, onDateChange }: WeekPickerProps) {
  const { currentDate, onPrevWeek, onNextWeek, isPrevDisabled, isNextDisabled } = useDateNavigation(
    selectedDate,
    onDateChange,
  );

  return (
    <>
      <Button
        type="outlined-assistive"
        leftIcon={<Icon icon="chevronLeft" />}
        className={`${styles.iconButton} ${styles.prevButton}`}
        disabled={isPrevDisabled}
        onClick={onPrevWeek}
      />

      <div className={styles.dateContainer}>
        <Icon icon="calendar" className={styles.calendarIcon} />
        <span className={styles.date}>
          {formattedDate(subDays(currentDate, 7))} -{" "}
          {isToday(currentDate) ? "오늘" : formattedDate(currentDate)}
        </span>
      </div>

      <Button
        type="outlined-assistive"
        leftIcon={<Icon icon="chevronRight" />}
        className={`${styles.iconButton} ${styles.nextButton}`}
        disabled={isNextDisabled}
        onClick={onNextWeek}
      />
    </>
  );
}

export default WeekPicker;
