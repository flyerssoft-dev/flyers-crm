// /** @format */

// import getApi from '@feature/notification/api/getApi';
// import { Card, Empty, Spin } from 'antd';
// import { useEffect, useState } from 'react';
// import getEventApi from '@feature/Events/api/getApi';
// import useAuthStore from '@feature/auth/store/useAuthStore';
// import axiosInstance from '@app/api/apiSlice';
// import { Buffer } from 'buffer';
// import FsTextTooltip from '@components/Tooltip';

// const EventCard = () => {
//   interface EventsType {
//     event_date: string;
//     notification_type: string;
//     message: string;
//     department: string;
//   }

//   interface EventsDataType {
//     event_date: string;
//     event_title: string;
//     event_start_date: string;
//     event_end_date: string;
//     description: string;
//   }

//   const [todayEvents, setTodayEvents] = useState<EventsType[]>([]);
//   const [upcomingEvents, setUpcomingEvents] = useState<EventsType[]>([]);
//   const [loadingTodayEvents, setLoadingTodayEvents] = useState<boolean>(false);
//   const [loadingUpcomingEvents, setLoadingUpcomingEvents] = useState<boolean>(false);
//   const [todaySchedules, setTodaySchedules] = useState<EventsDataType[]>([]);
//   const [upcomingSchedules, setUpcomingSchedules] = useState<EventsDataType[]>([]);
//   const [images, setImages] = useState<any>({});

//   const { getUserData } = useAuthStore();

//   const fetchImages = async (ID: string) => {
//     try {
//       const response = await axiosInstance.get(`files/${ID}`, {
//         responseType: 'arraybuffer',
//       });
//       const buffer = Buffer.from(response.data);
//       const base64String = buffer.toString('base64');
//       const objectURL = `data:image/jpeg;base64,${base64String}`;

//       setImages((prev: any) => ({ ...prev, [ID]: objectURL }));
//       // return objectURL;
//     } catch (error) {
//       throw error;
//     }
//   };
//   useEffect(() => {
//     fetchImages('1');
//     fetchImages('2');
//     fetchImages('3');
//   }, []);

//   const fetchTodayEvents = async () => {
//     setLoadingTodayEvents(true);
//     try {
//       const data = await getApi.getTodayEvents();
//       setTodayEvents(data);
//     } catch (error) {
//       throw error;
//     } finally {
//       setLoadingTodayEvents(false);
//     }
//   };

//   const fetchTodaySchedules = async () => {
//     setLoadingTodayEvents(true);
//     try {
//       const data = await getEventApi.EventsData();
//       setTodaySchedules(data.today_events);
//     } catch (error) {
//       throw error;
//     } finally {
//       setLoadingTodayEvents(false);
//     }
//   };

//   const fetchUpcomingEvents = async () => {
//     setLoadingUpcomingEvents(true);
//     try {
//       const data = await getApi.getUpcomingEvents();
//       setUpcomingEvents(data);
//     } catch (error) {
//       throw error;
//     } finally {
//       setLoadingUpcomingEvents(false);
//     }
//   };

//   const fetchUpcomingSchedules = async () => {
//     setLoadingUpcomingEvents(true);
//     try {
//       const data = await getEventApi.EventsData();
//       setUpcomingSchedules(data.upcoming_events);
//     } catch (error) {
//       throw error;
//     } finally {
//       setLoadingUpcomingEvents(false);
//     }
//   };

//   useEffect(() => {
//     fetchTodayEvents();
//     fetchUpcomingEvents();
//     fetchTodaySchedules();
//     fetchUpcomingSchedules();
//   }, []);

//   const getGifByEventType = (notification_type: string): number => {
//     if (notification_type.toLowerCase().includes('birthday')) {
//       return 3;
//     }
//     if (notification_type.toLowerCase().includes('anniversary')) {
//       return 2;
//     }
//     return 1;
//   };

//   const formatTime = (dateString: string): string => {
//     const date = new Date(dateString);
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const ampm = hours >= 12 ? 'PM' : 'AM';

//     const formattedHours = hours % 12 || 12;

//     if (minutes === 0) {
//       return `${formattedHours} ${ampm}`;
//     } else {
//       return `${formattedHours}.${minutes.toString().padStart(2, '0')} ${ampm}`;
//     }
//   };

//   const formatDate = (dateString: string): string => {
//     const date = new Date(dateString);
//     const options: Intl.DateTimeFormatOptions = {
//       day: 'numeric',
//       month: 'short',
//     };
//     return date.toLocaleDateString('en-US', options);
//   };
//   return (
//     <div className='2xl:gap-1 xl:gap-2 col'>
//       {/* {Card1} */}
//       <Card className='h-[44vh] 2xl:h-[45vh] xl:h-[45.5vh]'>
//         <h2 className='text-lg text-black font-medium'>Today Events</h2>
//         <div className=' scrollable h-[35vh]'>
//           {loadingTodayEvents ? (
//             <div className='h-[30vh] flex-center'>
//               <Spin size='large' />
//             </div>
//           ) : todayEvents.length === 0 && todaySchedules.length === 0 ? (
//             <div className='h-[30vh] flex-center'>
//               <Empty
//                 image={Empty.PRESENTED_IMAGE_SIMPLE}
//                 description='No Events / Celebrations Today'
//               />
//             </div>
//           ) : (
//             <>
//               {/* Today birthday's and anniversary's */}
//               {todayEvents.length > 0 && (
//                 <>
//                   <h3 className='text-xs text-black py-2'>Celebrations</h3>
//                   {todayEvents.map((data: EventsType, index) => {
//                     return (
//                       <div key={index} className='flex items-center gap-3 py-2'>
//                         <img
//                           src={
//                             getGifByEventType(data.notification_type)
//                               ? images[getGifByEventType(data.notification_type)]
//                               : ''
//                           }
//                           style={{ width: '55px', height: '55px' }}
//                         />
//                         <div>
//                           <h2 className='text-sm font-medium'>{data.message}</h2>
//                           <span className='text-xs font-normal text-grayText'>
//                             {data.department}
//                           </span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </>
//               )}

//               {/* Today schedules */}
//               {todaySchedules.length > 0 && (
//                 <>
//                   <hr className='border-0 h-[1px] bg-gradient-to-r from-gray to-mildWhite' />
//                   <div className='flex gap-2'>
//                     <p className='text-black font-medium text-[14px] leading-[19.6px] py-2'>
//                       Schedules
//                     </p>
//                     <img
//                       src={images['1']}
//                       alt='Announcement'
//                       style={{ width: '35px', height: '35px' }}
//                     />
//                   </div>
//                   {todaySchedules.map((data, index) => (
//                     <div key={index} className='col py-2'>
//                       <div className='flex-between'>
//                         <p className='text-sm font-medium'>{data.event_title}</p>
//                         <p>
//                           {formatTime(data.event_start_date)} - {formatTime(data.event_end_date)}
//                         </p>
//                       </div>
//                       <FsTextTooltip text={data.description}></FsTextTooltip>
//                     </div>
//                   ))}
//                 </>
//               )}
//             </>
//           )}
//         </div>
//       </Card>

//       {/* {Card2} */}
//       <Card className='h-[45vh] 2xl:h-[45vh] xl:h-[45.5vh]'>
//         <h2 className='text-lg text-black font-medium'>
//           Upcoming Events <span className='text-xs text-grayText'>(This Month)</span>
//         </h2>
//         <div className=' scrollable h-[35vh]'>
//           {loadingUpcomingEvents ? (
//             <div className='h-[30vh] flex-center'>
//               <Spin size='large' />
//             </div>
//           ) : (getUserData().department === 'Digital Marketing' &&
//               upcomingSchedules.length === 0 &&
//               upcomingEvents.length === 0) ||
//             (getUserData().department !== 'Digital Marketing' && upcomingSchedules.length == 0) ? (
//             <div className='h-[30vh] flex-center'>
//               <Empty
//                 image={Empty.PRESENTED_IMAGE_SIMPLE}
//                 description='No Upcoming Events This Month'
//               />
//             </div>
//           ) : (
//             <>
//               {getUserData().department === 'Digital Marketing' && upcomingEvents.length > 0 && (
//                 <>
//                   <h3 className='text-xs text-grayText py-2'>Celebrations</h3>
//                   {upcomingEvents.map((data: EventsType, index) => (
//                     <div key={index} className=''>
//                       <div className='flex items-center gap-3 py-2'>
//                         <img
//                           src={
//                             getGifByEventType(data.notification_type)
//                               ? images[getGifByEventType(data.notification_type)]
//                               : ''
//                           }
//                           alt='celebration'
//                           style={{
//                             width: '55px',
//                             height: '55px',
//                             borderRadius: '5px',
//                           }}
//                         />
//                         <div className='w-[80%]'>
//                           <h2 className='text-sm font-medium'>{data.message}</h2>
//                           <div className='flex items-center justify-between pr-4'>
//                             <p className='text-xs font-normal text-grayText'>{data.department}</p>
//                             {formatDate(data.event_date)}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </>
//               )}
//               {upcomingSchedules.length > 0 && (
//                 <>
//                   <hr className='border-0 h-[1px] bg-gradient-to-r from-gray to-mildWhite' />
//                   <div className='flex gap-2'>
//                     <p className='text-black font-medium text-[14px] leading-[19.6px] py-2'>
//                       Upcoming Schedules
//                     </p>
//                     <img
//                       src={images[1]}
//                       alt='schedule type'
//                       style={{ width: '35px', height: '35px' }}
//                     />
//                   </div>
//                   {upcomingSchedules.map((data, index) => (
//                     <div key={index} className='flex justify-between py-2'>
//                       <div className='flex rounded-md p-2 w-full'>
//                         <div className='flex flex-col pr-4 w-[60%] gap-2'>
//                           <p className='text-sm font-medium capitalize whitespace-nowrap'>
//                             {data.event_title}
//                           </p>
//                           <FsTextTooltip text={data.description}></FsTextTooltip>

//                           {/* <p>{formatDate(data.event_start_date)}</p> */}
//                           {/* {formatTime(data.event_start_date)} -{" "}
//                         {formatTime(data.event_end_date)} */}
//                         </div>
//                         <div className='flex flex-col w-[50%] gap-2'>
//                           {/* <p className="text-grayText capitalize">
//                           {data.description}
//                         </p> */}
//                           {/* {formatTime(data.event_start_date)} -{" "}
//                       {formatTime(data.event_end_date)} */}
//                           <p className='flex justify-end'>{formatDate(data.event_start_date)}</p>
//                           <p className=' flex justify-end whitespace-nowrap'>
//                             {formatTime(data.event_start_date)} - {formatTime(data.event_end_date)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </>
//               )}
//             </>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default EventCard;
