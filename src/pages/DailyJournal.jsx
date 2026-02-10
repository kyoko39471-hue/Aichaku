  import { useMemo } from 'react';
  import {
    Package,
    Sparkles,
    Coffee,
    Calendar,
    Clock,
    History,
    ArrowRight
  } from 'lucide-react';
  import { useJournal } from '../hooks/useJournal';

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // --- Daily Journal View (Aichaku data model) ---
  const DailyJournal = ({ user, onSwitchTab }) => {
    const {
      selectedDate,
      events,
      eventsByCategory,
      loading,
      goPrevDay,
      goNextDay,
      goToday
    } = useJournal(user);

    const totalLogs = useMemo(() => events.length, [events]);

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <Clock size={48} className="mb-4 opacity-20" />
          <p className="font-serif italic text-lg text-center px-4">
            Loading your journal...
          </p>
        </div>
      );
    }

    if (!events || events.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <Clock size={48} className="mb-4 opacity-20" />
          <p className="font-serif italic text-lg text-center px-4 mb-6">
            No entries yet for this day. Start logging to build your story.
          </p>
          <button
            onClick={() => onSwitchTab?.('All')}
            className="flex items-center gap-2 text-stone-900 font-bold text-sm border-b border-stone-900 pb-1"
          >
            Go to Collection <ArrowRight size={16} />
          </button>
        </div>
      );
    }

    const categoryIcons = {
      Closet: <Package size={14} />,
      Beauty: <Sparkles size={14} />,
      Appliances: <Coffee size={14} />,
    };

    return (
      <div className="max-w-2xl mx-auto pb-20">
        {/* Header / Meta */}
        <div className="flex items-center gap-4 mb-12 pb-6 border-b border-stone-200">
          <div className="flex items-center gap-2 text-stone-400">
            <History size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">
              {totalLogs} Entries Logged
            </span>
          </div>
          <div className="w-1 h-1 rounded-full bg-stone-300"></div>
          <div className="text-xs text-stone-400 uppercase tracking-widest font-bold">
            {formatDate(selectedDate)}
          </div>

          {/* 日期导航（可选） */}
          <div className="ml-auto flex items-center gap-2 text-xs text-stone-400">
            <button onClick={goPrevDay} className="hover:text-stone-900">Prev</button>
            <button onClick={goToday} className="hover:text-stone-900">Today</button>
            <button onClick={goNextDay} className="hover:text-stone-900">Next</button>
          </div>
        </div>

        {/* Timeline for single day */}
        <div className="space-y-12">
          <section className="relative pl-10 border-l border-stone-200 ml-2">
            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-[0_0_0_4px_rgba(255,255,255,1)]"></div>
            <h2 className="text-lg font-serif italic mb-6 text-stone-800 leading-none">
              {formatDate(selectedDate)}
            </h2>

            <div className="space-y-4">
              {Object.entries(eventsByCategory).map(([catName, itemList]) => (
                <div key={catName} className="group">
                  <div className="flex items-center gap-2 mb-2 text-stone-400">
                    {categoryIcons[catName] || <Calendar size={14} />}
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em]">
                      {catName}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm group-hover:border-stone-200 transition-colors">
                    <ul className="space-y-2">
                      {itemList.map((event) => (
                        <li key={event.id} className="text-sm text-stone-600 flex items-start gap-2">
                          <span className="text-stone-300 font-serif leading-tight">•</span>
                          <span className="leading-tight">
                            {event.brand || 'Unknown'} * {event.itemName || 'Unnamed'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  };

  export default DailyJournal;