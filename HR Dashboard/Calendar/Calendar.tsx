// import React from 'react'
// import { KTIcon } from '../../../../../_metronic/helpers'


// type Props = {
//     className: string
// }

// function Requests({ className }: Props) {
//     return (
//         <>
//             <div className={` ${className}`}>
//                 <div className='card'>
//                     <div className='conatiner-fluid'>
//                         <div className='row'>
//                             <div className='col-lg-6'>
//                                 <div className='card'>

//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Requests
// import React, { useState } from 'react';

// interface Event {
//   id: number;
//   title: string;
//   date: string;
// }

// interface EventCalendarProps {
//   events: Event[];
// }

// const EventCalendar: React.FC<EventCalendarProps> = ({ events }) => {
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

//   const handleEventClick = (event: Event) => {
//     setSelectedEvent(event);
//   };

//   return (
//     <div>
//       {events.map((event) => (
//         <div key={event.id} onClick={() => handleEventClick(event)}>
//           <span>{event.date}</span>
//           <span>{event.title}</span>
//         </div>
//       ))}
//       {selectedEvent && (
//         <div>
//           <h2>{selectedEvent.title}</h2>
//           <p>Date: {selectedEvent.date}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EventCalendar;

// import React, { useState } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';

// const MyCalendar: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const handleDateChange = (date: Date) => {
//     setSelectedDate(date);
//   };

//   return (
//     <div>
//       <h1>My Calendar</h1>
//       <Calendar onChange={handleDateChange} value={selectedDate} />
//     </div>
//   );
// };

// export default MyCalendar;

import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { Badge } from '@mui/material';
// import '..//..//..//Qs_css/Autocomplete.css'
type Props = {
  className: string
}
function getRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}
function fakeFetch(date: Dayjs, { signal }: { signal: AbortSignal }) {
  return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysInMonth = date.daysInMonth();
      const daysToHighlight = [1, 2, 3].map(() => getRandomNumber(1, daysInMonth));

      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException('aborted', 'AbortError'));
    };
  });
}

// const initialValue = dayjs('2022-04-17');
const calendarStyles = {
  width: '300px' // Set the desired width here
};

function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? '🌚' : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

export default function DateCalendarServerRequest({ className }: Props) {
  const requestAbortController = React.useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);

  const fetchHighlightedDays = (date: Dayjs) => {
    const controller = new AbortController();
    fakeFetch(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        // ignore the error if it's caused by `controller.abort`
        if (error.name !== 'AbortError') {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  // React.useEffect(() => {
  //   fetchHighlightedDays(initialValue);
  //   // abort request on unmount
  //   return () => requestAbortController.current?.abort();
  // }, []);

  const handleMonthChange = (date: Dayjs) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={` ${className}`}>
        <div className='card '>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-lg-6 col-md-6'>
                <div className='card'>
                  <div className='card-body'>
                    <DateCalendar
                      // defaultValue={initialValue}

                      className='mb-3'
                      loading={isLoading}
                      onMonthChange={handleMonthChange}
                      renderLoading={() => <DayCalendarSkeleton />}
                      slots={{
                        day: ServerDay,
                      }}
                      slotProps={{
                        day: {
                          highlightedDays,
                        } as any,

                      }}
                    />
                  </div>
                </div>
              </div>
              <div className='col-lg-6 col-md-6'>
                <div className='card '>
                  <div className='card-body'>
                    <div className='card-header border-0 mb-3 ms-5 mt-5 me-5'>
                      <h3 className='card-title text-gray-800 fw-bold'>

                      </h3>
                      <div className='card-toolbar'>
                        <button
                          className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                          data-kt-menu-trigger='click'
                          data-kt-menu-placement='bottom-end'
                          data-kt-menu-flip='top-end'>
                          <i className='bi bi-three-dots-vertical fs-3'></i>
                        </button>
                      </div>
                    </div>

                    <div className='card-body'>
                      <div className='ms-5 d-flex align-items-start flex-column mt-12 mb-5'>
                        <h3>Events</h3>
                        <span className='badge badge-light-info fs-6 fw-bold rounded mb-2' >July 15 2023</span>
                        <p className='fw-bold text-gray-800 text-hover-info fs-5'>
                          World Company Day
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}


