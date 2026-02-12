  import { useEffect, useMemo, useState } from 'react';
  import { getJournalDays, getJournalEventsForDay, deleteJournalEventAndDecrementItem } from '../services/firestoreService';

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  export const useJournal = (user) => {
    const [journalEntries, setJournalEntries] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!user) {
        setJournalEntries([]);
        return;
      }

      const fetchTimeline = async () => {
        setLoading(true);

        // 1) 先拿到所有有日志的日期
        const days = await getJournalDays(user.uid);

        // 2) 再按日期拿 events，并分组到 categories
        const entries = await Promise.all(
          days.map(async (day) => {
            const events = await getJournalEventsForDay(user.uid, day.id);
            const categories = events.reduce((acc, event) => {
              const key = event.category || 'Uncategorized';
              if (!acc[key]) acc[key] = [];
              acc[key].push(event);
              return acc;
            }, {});

            return {
              date: day.id,
              formattedDate: formatDate(day.id),
              categories
            };
          })
        );

        setJournalEntries(entries);
        setLoading(false);
      };

      fetchTimeline();
    }, [user]);

    const totalLogs = useMemo(() => {
      return journalEntries.reduce((sum, day) => {
        const count = Object.values(day.categories)
          .reduce((acc, arr) => acc + arr.length, 0);
        return sum + count;
      }, 0);
    }, [journalEntries]);

    const removeEvent = async (dateId, event) => {
        if (!user) return;

        await deleteJournalEventAndDecrementItem(user.uid, dateId, event);

        setJournalEntries(prev =>
        prev
            .map(day => {
            if (day.date !== dateId) return day;

            const newCategories = Object.fromEntries(
                Object.entries(day.categories).map(([cat, list]) => [
                cat,
                list.filter(ev => ev.id !== event.id)
                ])
            );

            return { ...day, categories: newCategories };
            })
            .filter(day =>
            Object.values(day.categories).some(list => list.length > 0)
            )
        );
    };

    return {
      journalEntries,
      totalLogs,
      loading,
      removeEvent
    };
  };