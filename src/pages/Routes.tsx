import { ReservationStatusPage } from './ReservationStatusPage';
import { RoomBookingPage } from './RoomBookingPage';
import { Route, Routes as ReactRouterRoutes, Navigate } from 'react-router-dom';
import { ROUTES } from 'pages/constants';

export const Routes = () => {
  return (
    <ReactRouterRoutes>
      <Route path={ROUTES.HOME} element={<ReservationStatusPage />} />
      <Route path={ROUTES.BOOKING} element={<RoomBookingPage />} />
      <Route path="*" element={<Navigate replace to={ROUTES.HOME} />} />
    </ReactRouterRoutes>
  );
};
