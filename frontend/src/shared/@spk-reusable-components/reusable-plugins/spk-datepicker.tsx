import React from 'react';
import DatePicker from 'react-datepicker';


interface SpkDatepickrProps {
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  showTimeSelect?: boolean;
  timeFormat?: string;
  timeIntervals?: number;
  minDate?: Date;
  maxDate?: Date;
  isClearable?: boolean;
  placeholderText?: string;
  className?: string;
  Timeinput?: string;
  disabled?: boolean;
  Inline?: boolean;
  showTimeInput?: boolean;
  Iconvisible?: boolean;
  showTimeSelectOnly?: boolean;
  Caption?: string;
  Localtime?: string;
  Yearpicker?: boolean;
  endDate?:Date | null;
  selectsRange?:any;
  startDate?:Date | null;
  showWeekNumbers?:boolean
}

const SpkDatepickr: React.FC<SpkDatepickrProps> = ({
  selected,
  onChange,
  dateFormat = 'dd/MM/yyyy',
  showTimeSelect = false,
  timeFormat = 'HH:mm',
  timeIntervals = 30,
  minDate,
  maxDate,
  Timeinput,
  isClearable,
  placeholderText = 'Select a date',
  className = '',
  disabled = false,
  Iconvisible,
  showTimeSelectOnly,
  showTimeInput,
  Localtime,
  showWeekNumbers,
  Caption,
  Inline,
  Yearpicker,
  endDate,
  selectsRange,
  startDate,
  ...props
}) => {
  return (
    <DatePicker selected={selected} startDate={startDate} onChange={onChange} dateFormat={dateFormat} timeInputLabel={Timeinput} showTimeSelect={showTimeSelect} timeFormat={timeFormat} timeIntervals={timeIntervals} showTimeSelectOnly={showTimeSelectOnly} minDate={minDate} maxDate={maxDate} isClearable={isClearable} placeholderText={placeholderText} className={className} endDate={endDate} disabled={disabled} showIcon={Iconvisible} inline={Inline} showTimeInput={showTimeInput} timeCaption={Caption} showMonthYearPicker={Yearpicker} locale={Localtime} selectsRange={selectsRange} showWeekNumbers={showWeekNumbers}
      {...props} // Forward any additional props to DatePicker
    />
  );
};

export default SpkDatepickr;
