import Popup from '../PopUp/PopUp';
import NewEvent from '../PopUp/NewEvent';
import Settings from '../PopUp/Settings';
import NewCalendar from '../PopUp/NewClendar';
import EditCalendar from '../PopUp/EditCalendar';
import InviteUsers from '../PopUp/InviteUsers';
import ManageMembers from '../PopUp/ManageMembers';

export default function PopupController({
  popup,
  position,
  onClose,
  context,
  callbacks
}) {
  if (!popup) return null;

  const commonProps = { onClose };

  const views = {
    event: (
      <NewEvent
        calendarId={context?.primaryCalendarId}
        onEventCreated={callbacks?.onEventCreated}
        {...commonProps}
      />
    ),
    settings: <Settings {...commonProps} />,
    calendar: (
      <NewCalendar
        onCreate={callbacks?.onCalendarCreated}
        {...commonProps}
      />
    ),
    "edit-calendar": (
      <EditCalendar
        calendar={context?.editingCalendar}
        onSave={callbacks?.onCalendarEdited}
        {...commonProps}
      />
    ),
    invite: (
      <InviteUsers
        calendarId={context?.calendarId}
        {...commonProps}
      />
    ),
    "manage-members": (
      <ManageMembers
        calendarId={context?.calendarId}
        {...commonProps}
      />
    )
  };

  return (
    <Popup position={position} onClose={onClose}>
      {views[popup] ?? null}
    </Popup>
  );
}
