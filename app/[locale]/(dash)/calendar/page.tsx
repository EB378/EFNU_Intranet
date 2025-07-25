"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { 
  useList, 
  useCreate, 
  useUpdate, 
  useDelete,
  useGetIdentity,
  CanAccess,
} from "@refinedev/core";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Container,
  useTheme,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Divider,
  CircularProgress,
  Tooltip
} from "@mui/material";
import {
  Today as TodayIcon,
  ViewWeek as ViewWeekIcon,
  ViewDay as ViewDayIcon,
  ViewAgenda as ViewAgendaIcon,
  ViewModule as ViewMonthIcon,
  MoreVert as MoreIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon
} from "@mui/icons-material";
import { DatePicker, TimePicker, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, addHours, isSameDay } from "date-fns";
import { useRouter } from "next/navigation";

type CalendarEvent = {
  id: string;
  title: string;
  start_time: Date | string;
  end_time: Date | string;
  is_all_day: boolean;
  description?: string;
  location?: string;
  event_type: string;
  status: string;
  timezone: string;
  organizer_id: string;
};

type EventFormData = {
  id: string;
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  is_all_day: boolean;
  location: string;
  event_type: string;
  status: string;
  timezone: string;
};

const CalendarPage = () => {
  const theme = useTheme();
  const calendarRef = useRef<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentView, setCurrentView] = useState<string>("dayGridMonth");
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const open = Boolean(anchorEl);
  const [openModal, setOpenModal] = useState<"create" | "edit" | "details" | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventForm, setEventForm] = useState<EventFormData>({
    id: "",
    title: "",
    description: "", 
    start_time: new Date(),
    end_time: addHours(new Date(), 1),
    is_all_day: false,
    location: "",
    event_type: "general",
    status: "confirmed",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  // Refine hooks
  const { data: eventsData, isLoading: eventsLoading } = useList<CalendarEvent>({
    resource: "events",
    pagination: {
      mode: "off",
    },
  });
  
  const { mutate: createEvent } = useCreate();
  const { mutate: updateEvent } = useUpdate();
  const { mutate: deleteEvent } = useDelete();
  const router = useRouter();
  type UserIdentity = { id: string; name?: string; email?: string };
  const { data: userIdentity } = useGetIdentity<UserIdentity>();
  const [organizer, setOrganizer] = useState<any>(null);

  // Map backend events to FullCalendar format
  const events = useMemo(() => {
    return eventsData?.data?.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start_time,
      end: event.end_time,
      allDay: event.is_all_day,
      extendedProps: {
        description: event.description,
        location: event.location,
        event_type: event.event_type,
        status: event.status,
        timezone: event.timezone,
        organizer_id: event.organizer_id
      }
    })) || [];
  }, [eventsData]);

  // Update calendar title when view changes
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const updateTitle = () => {
        const view = calendarApi.view;
        let title = "";
        
        if (view.type === "dayGridMonth") {
          title = format(view.currentStart, "MMMM yyyy");
        } else if (view.type === "timeGridWeek") {
          const start = view.currentStart;
          const end = new Date(view.currentEnd);
          end.setDate(end.getDate() - 1); // Adjust end date
          
          if (isSameDay(start, end)) {
            title = format(start, "MMMM d, yyyy");
          } else if (start.getMonth() === end.getMonth()) {
            title = `${format(start, "MMMM d")} - ${format(end, "d, yyyy")}`;
          } else {
            title = `${format(start, "MMMM d")} - ${format(end, "MMMM d, yyyy")}`;
          }
        } else if (view.type === "timeGridDay") {
          title = format(view.currentStart, "EEEE, MMMM d, yyyy");
        } else if (view.type === "listWeek") {
          const start = view.currentStart;
          const end = new Date(view.currentEnd);
          end.setDate(end.getDate() - 1); // Adjust end date
          title = `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
        }
        
        setCurrentTitle(title);
      };
      
      calendarApi.on("datesSet", updateTitle);
      updateTitle();
      
      return () => {
        calendarApi.off("datesSet", updateTitle);
      };
    }
  }, [currentView]);

  const handleDateSelect = (selectInfo: any) => {
    const start = selectInfo.start;
    const end = selectInfo.end || addHours(selectInfo.start, 1);
    
    setEventForm({
      id: "",
      title: "",
      description: "",
      start_time: start,
      end_time: end,
      is_all_day: selectInfo.allDay,
      location: "",
      event_type: "general",
      status: "confirmed",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    setOpenModal("create");
  };

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start_time: event.start,
      end_time: event.end,
      is_all_day: event.allDay,
      description: event.extendedProps.description,
      location: event.extendedProps.location,
      event_type: event.extendedProps.event_type,
      status: event.extendedProps.status,
      timezone: event.extendedProps.timezone,
      organizer_id: event.extendedProps.organizer_id
    });
    
    setOpenModal("details");
  };

  const handleCreateEvent = () => {
    setEventForm({
      id: "",
      title: "",
      description: "",
      start_time: new Date(),
      end_time: addHours(new Date(), 1),
      is_all_day: false,
      location: "",
      event_type: "general",
      status: "confirmed",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    setOpenModal("create");
  };

  const handleTodayClick = () => {
    calendarRef.current?.getApi().today();
  };

  const handlePrevClick = () => {
    calendarRef.current?.getApi().prev();
  };

  const handleNextClick = () => {
    calendarRef.current?.getApi().next();
  };

  const handleViewChange = (view: string) => {
    calendarRef.current?.getApi().changeView(view);
    setCurrentView(view);
    setAnchorEl(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenEditModal = () => {
    if (!selectedEvent) return;
    
    setEventForm({
      id: selectedEvent.id,
      title: selectedEvent.title,
      description: selectedEvent.description || "",
      start_time: new Date(selectedEvent.start_time),
      end_time: selectedEvent.end_time ? new Date(selectedEvent.end_time) : addHours(new Date(selectedEvent.start_time), 1),
      is_all_day: selectedEvent.is_all_day,
      location: selectedEvent.location || "",
      event_type: selectedEvent.event_type,
      status: selectedEvent.status,
      timezone: selectedEvent.timezone
    });
    setOpenModal("edit");
  };

  const handleCloseModal = () => {
    setOpenModal(null);
    setSelectedEvent(null);
    setOrganizer(null);
  };

  const handleFormChange = (field: keyof EventFormData, value: any) => {
    setEventForm(prev => ({ ...prev, [field]: value }));
    
    // Adjust end time if start time changes and it's before end time
    if (field === "start_time" && value instanceof Date) {
      if (value > eventForm.end_time) {
        setEventForm(prev => ({ 
          ...prev, 
          end_time: addHours(value, 1) 
        }));
      }
    }
  };

  const handleSaveEvent = () => {
    const eventData = {
      title: eventForm.title,
      description: eventForm.description,
      start_time: eventForm.start_time.toISOString(),
      end_time: eventForm.end_time.toISOString(),
      is_all_day: eventForm.is_all_day,
      location: eventForm.location,
      event_type: eventForm.event_type,
      status: eventForm.status,
      timezone: eventForm.timezone,
    };

    if (openModal === "create") {
      createEvent({
        resource: "events",
        values: eventData,
        successNotification: { 
          message: "Event created successfully!", 
          type: "success" 
        },
      });
    } else if (openModal === "edit") {
      updateEvent({
        resource: "events",
        id: eventForm.id,
        values: eventData,
        successNotification: { 
          message: "Event updated successfully!", 
          type: "success" 
        },
      });
    }
    
    handleCloseModal();
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    
    deleteEvent({
      resource: "events",
      id: selectedEvent.id,
      successNotification: { 
        message: "Event deleted successfully!", 
        type: "success" 
      },
    });
    
    handleCloseModal();
  };

  const handleShowPage = () => {
    if (!selectedEvent) return;
    
    // Redirect to event details page
    router.push(`/calendar/${selectedEvent.id}`);
  };

  const renderViewButtons = () => (
    <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
      <Tooltip title="Month view">
        <IconButton 
          onClick={() => handleViewChange("dayGridMonth")}
          color={currentView === "dayGridMonth" ? "primary" : "default"}
        >
          <ViewMonthIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Week view">
        <IconButton 
          onClick={() => handleViewChange("timeGridWeek")}
          color={currentView === "timeGridWeek" ? "primary" : "default"}
        >
          <ViewWeekIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Day view">
        <IconButton 
          onClick={() => handleViewChange("timeGridDay")}
          color={currentView === "timeGridDay" ? "primary" : "default"}
        >
          <ViewDayIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Agenda view">
        <IconButton 
          onClick={() => handleViewChange("listWeek")}
          color={currentView === "listWeek" ? "primary" : "default"}
        >
          <ViewAgendaIcon />
        </IconButton>
      </Tooltip>
      <IconButton onClick={handleMenuClick}>
        <MoreIcon />
      </IconButton>
    </Stack>
  );

  const renderEventContent = (eventInfo: any) => {
    const eventTypeColor = () => {
      switch (eventInfo.event.extendedProps.event_type) {
        case 'meeting': return theme.palette.primary.main;
        case 'training': return theme.palette.secondary.main;
        case 'event': return theme.palette.success.main;
        case 'reminder': return theme.palette.warning.main;
        case 'holiday': return theme.palette.error.main;
        case 'personal': return theme.palette.info.main;
        default: return theme.palette.primary.main;
      }
    };

    return (
      <Box sx={{ 
        p: 0.5, 
        borderLeft: `3px solid ${eventTypeColor()}`,
        backgroundColor: theme.palette.background.paper,
        height: '100%',
        overflow: 'hidden'
      }}>
        <Typography variant="body2" sx={{ 
          fontWeight: 500, 
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {eventInfo.timeText && (
            <span style={{ marginRight: 4 }}>{eventInfo.timeText}</span>
          )}
          {eventInfo.event.title}
        </Typography>
        {eventInfo.event.extendedProps.location && (
          <Typography variant="caption" sx={{ 
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {eventInfo.event.extendedProps.location}
          </Typography>
        )}
      </Box>
    );
  };

  // Fetch organizer details when event details are opened
  useEffect(() => {
    if (openModal === "details" && selectedEvent?.organizer_id) {
      if (userIdentity?.id === selectedEvent.organizer_id) {
        setOrganizer(userIdentity);
      } else {
        // In a real app, you'd fetch organizer details from API
        setOrganizer({
          id: selectedEvent.organizer_id,
          name: "Organizer Name",
          email: "organizer@example.com"
        });
      }
    }
  }, [openModal, selectedEvent, userIdentity]);

  return (
    <Container maxWidth="xl" sx={{ py: 4, mb: "10vh" }}>
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        mb: 4,
        flexWrap: "wrap",
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Calendar
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handlePrevClick} size="small">
              <PrevIcon />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
              {currentTitle}
            </Typography>
            <IconButton onClick={handleNextClick} size="small">
              <NextIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
          <Button 
            variant="outlined" 
            startIcon={<TodayIcon />}
            onClick={handleTodayClick}
          >
            Today
          </Button>
          <CanAccess resource="calendar" action="create">
            <Button 
              variant="contained"
              onClick={handleCreateEvent}
            >
              Create Event
            </Button>
          </CanAccess>
          
          {renderViewButtons()}
        </Stack>
      </Box>

      <Box sx={{
        p: 3,
        borderRadius: 4,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        height: "75vh"
      }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView={currentView}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          nowIndicator={true}
          events={events}
          eventContent={renderEventContent}
          headerToolbar={false}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="100%"
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: "short",
            hour12: true
          }}
          eventDisplay="block"
          eventMaxStack={2}
          eventOrder="start,-duration,allDay,title"
          navLinks={true}
          dayMaxEventRows={4}
          moreLinkClick="popover"
          eventDidMount={(info) => {
            // Add tooltip for events with long titles
            if (info.event.title.length > 30 || (info.event.extendedProps.description && info.event.extendedProps.description.length > 50)) {
              const tooltip = document.createElement('div');
              tooltip.innerHTML = `
                <div style="padding: 8px; max-width: 300px;">
                  <strong>${info.event.title}</strong>
                  ${info.event.extendedProps.description ? `<p style="margin-top: 4px;">${info.event.extendedProps.description}</p>` : ''}
                  ${info.event.extendedProps.location ? `<p style="margin-top: 4px;"><small>Location: ${info.event.extendedProps.location}</small></p>` : ''}
                </div>
              `;
              info.el.setAttribute('data-tooltip', '');
              info.el.addEventListener('mouseenter', () => {
                const popper = document.createElement('div');
                popper.style.position = 'absolute';
                popper.style.zIndex = '9999';
                popper.style.pointerEvents = 'none';
                popper.innerHTML = tooltip.innerHTML;
                popper.style.backgroundColor = theme.palette.background.paper;
                popper.style.borderRadius = '4px';
                popper.style.boxShadow = theme.shadows[3];
                popper.style.padding = '8px';
                popper.style.maxWidth = '300px';
                
                document.body.appendChild(popper);
                
                const updatePosition = () => {
                  const rect = info.el.getBoundingClientRect();
                  popper.style.left = `${rect.left + window.scrollX}px`;
                  popper.style.top = `${rect.top + window.scrollY + rect.height + 4}px`;
                };
                
                updatePosition();
                const interval = setInterval(updatePosition, 100);
                
                info.el.addEventListener('mouseleave', () => {
                  clearInterval(interval);
                  document.body.removeChild(popper);
                }, { once: true });
              });
            }
          }}
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewChange("dayGridYear")}>
          Year View
        </MenuItem>
        <MenuItem onClick={() => handleViewChange("dayGridMonth")}>
          Month View
        </MenuItem>
      </Menu>

      {/* Event Details Modal */}
      <Dialog 
        open={openModal === "details"} 
        onClose={handleCloseModal} 
        fullWidth 
        maxWidth="sm"
        sx={{mb:"10vh", maxHeight: "85vh"}}
      >
        {selectedEvent ? (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ 
                maxWidth: '70%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {selectedEvent.title}
                <Chip 
                  label={selectedEvent.event_type} 
                  color="primary" 
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
              <Chip 
                label={selectedEvent.status} 
                color={
                  selectedEvent.status === 'cancelled' ? 'error' : 
                  selectedEvent.status === 'tentative' ? 'warning' : 'success'
                }
                size="small"
              />
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Date & Time</Typography>
                  <Typography>
                    {selectedEvent.is_all_day
                      ? format(new Date(selectedEvent.start_time), 'MMM d, yyyy') + ' (All Day)'
                      : `${format(new Date(selectedEvent.start_time), 'MMM d, yyyy h:mm a')} - ${
                          selectedEvent.end_time ? format(new Date(selectedEvent.end_time), 'h:mm a') : ''
                        }`
                    }
                  </Typography>
                </div>
                
                {selectedEvent.location && (
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Location</Typography>
                    <Typography>{selectedEvent.location}</Typography>
                  </div>
                )}
                
                {selectedEvent.description && (
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                    <Typography sx={{ 
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}>
                      {selectedEvent.description}
                    </Typography>
                  </div>
                )}
                
                <Divider />
                
                <Stack direction="row" spacing={2}>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Organizer</Typography>
                    {organizer ? (
                      <Typography>{organizer.name}</Typography>
                    ) : (
                      <CircularProgress size={20} />
                    )}
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Timezone</Typography>
                    <Typography>{selectedEvent.timezone}</Typography>
                  </div>
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleShowPage} variant="outlined">Show</Button>
              <CanAccess resource="calendar" action="edit">
                <Button onClick={handleDeleteEvent} color="error">Delete</Button>
                <Button onClick={handleOpenEditModal} variant="contained">Edit</Button>
              </CanAccess>
            </DialogActions>
          </>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        )}
      </Dialog>

      {/* Create/Edit Event Modal */}
      <CanAccess resource="calendar" action="edit">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Dialog 
            open={openModal === "create" || openModal === "edit"} 
            onClose={handleCloseModal}
            fullWidth
            maxWidth="md"
            sx={{mb:"10vh", maxHeight: "85vh"}}
          >
            <DialogTitle>
              {openModal === "create" ? "Create New Event" : "Edit Event"}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 1 }}>
                <TextField
                  label="Event Title"
                  fullWidth
                  value={eventForm.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  required
                  inputProps={{ maxLength: 100 }}
                />
                
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  inputProps={{ maxLength: 500 }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={eventForm.is_all_day} 
                      onChange={(e) => handleFormChange('is_all_day', e.target.checked)}
                    />
                  }
                  label="All Day Event"
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    {eventForm.is_all_day ? (
                      <DatePicker
                        label="Start Date"
                        value={eventForm.start_time}
                        onChange={(date) => date && handleFormChange('start_time', date)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    ) : (
                      <DateTimePicker
                        label="Start Time"
                        value={eventForm.start_time}
                        onChange={(date) => date && handleFormChange('start_time', date)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {eventForm.is_all_day ? (
                      <DatePicker
                        label="End Date"
                        value={eventForm.end_time}
                        onChange={(date) => date && handleFormChange('end_time', date)}
                        slotProps={{ textField: { fullWidth: true } }}
                        minDate={eventForm.start_time}
                      />
                    ) : (
                      <DateTimePicker
                        label="End Time"
                        value={eventForm.end_time}
                        onChange={(date) => date && handleFormChange('end_time', date)}
                        slotProps={{ textField: { fullWidth: true } }}
                        minDate={eventForm.start_time}
                      />
                    )}
                  </Grid>
                </Grid>
                
                <TextField
                  label="Location"
                  fullWidth
                  value={eventForm.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  inputProps={{ maxLength: 100 }}
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Event Type</InputLabel>
                      <Select
                        value={eventForm.event_type}
                        label="Event Type"
                        onChange={(e) => handleFormChange('event_type', e.target.value)}
                      >
                        {['meeting', 'training', 'event', 'reminder', 'holiday', 'personal'].map(type => (
                          <MenuItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={eventForm.status}
                        label="Status"
                        onChange={(e) => handleFormChange('status', e.target.value)}
                      >
                        {['confirmed', 'tentative', 'cancelled'].map(status => (
                          <MenuItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={eventForm.timezone}
                    label="Timezone"
                    onChange={(e) => handleFormChange('timezone', e.target.value)}
                  >
                    {Intl.supportedValuesOf('timeZone').map(tz => (
                      <MenuItem key={tz} value={tz}>{tz}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button 
                onClick={handleSaveEvent} 
                variant="contained"
                disabled={!eventForm.title.trim()}
              >
                {openModal === "create" ? "Create Event" : "Save Changes"}
              </Button>
            </DialogActions>
          </Dialog>
        </LocalizationProvider>
      </CanAccess>
    </Container>
  );
};

export default CalendarPage;