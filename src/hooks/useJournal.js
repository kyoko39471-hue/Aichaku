  // src/hooks/useJournal.js
  import { useEffect, useMemo, useState } from 'react';
  import { getJournalEventsForDay } from '../services/firestoreService';

  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const addDays = (dateString, delta) => {
    const [y, m, d] = dateString.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + delta);
    return getLocalDateString(date);
  };

  export const useJournal = (user, initialDate) => {
    const [selectedDate, setSelectedDate] = useState(
      initialDate || getLocalDateString()
    );
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!user) {
        setEvents([]);
        return;
      }

      const fetchEvents = async () => {
        setLoading(true);
        const data = await getJournalEventsForDay(user.uid, selectedDate);
        setEvents(data);
        setLoading(false);
      };

      fetchEvents();
    }, [user, selectedDate]);

    const goPrevDay = () => setSelectedDate(d => addDays(d, -1));
    const goNextDay = () => setSelectedDate(d => addDays(d, 1));
    const goToday = () => setSelectedDate(getLocalDateString());

    const eventsByCategory = useMemo(() => {
      return events.reduce((acc, event) => {
        const key = event.category || 'Uncategorized';
        if (!acc[key]) acc[key] = [];
        acc[key].push(event);
        return acc;
      }, {});
    }, [events]);

    return {
      selectedDate,
      setSelectedDate,
      events,
      eventsByCategory,
      loading,
      goPrevDay,
      goNextDay,
      goToday
    };
  };
