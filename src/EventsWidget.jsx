import React from 'react';

function EventsWidget({ events, onPrev, onNext, loading, error }) {
  return (
    <div id="events-panel" className="text-left font-serif">
      <div className="mb-2">
        <h3 className="m-0 text-[1.6em] leading-tight text-white">Events</h3>
      </div>
      <div>
        {error && <p className="text-red-300">Error: {error}</p>}
        {loading && <p className="text-[#b8c1e0]">Loading events...</p>}
        <div id="events" className="mt-0 h-[500px] space-y-6 overflow-y-auto">
          {events.map((event, index) => (
            <div key={index} className="mx-auto box-border block h-[100px] w-full max-w-[320px] cursor-pointer overflow-hidden rounded-md bg-[#262e61] p-4 text-white">
              <h4 className="mb-2 overflow-hidden text-base font-semibold text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">{event.name}</h4>
              <p className="my-1 overflow-hidden text-ellipsis whitespace-nowrap text-[0.9em] text-[#b8c1e0]">{event.dates?.start?.localDate || 'Date not available'}</p>
              <p className="mt-1 mb-0 overflow-hidden text-ellipsis whitespace-nowrap text-[0.85em] text-[#9aa7ff]">
                {event._embedded?.venues?.[0] ? `${event._embedded.venues[0].name} in ${event._embedded.venues[0].city?.name || ''}` : 'Venue not available'}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3">
        <nav>
          <ul className="flex items-center justify-center gap-3">
            <li id="prev"><a className="inline-flex rounded-md border border-[#9aa7ff] bg-[#141b48] px-3 py-1 text-white transition hover:border-white" href="#" onClick={(e) => { e.preventDefault(); onPrev(); }}><span aria-hidden="true">&larr;</span></a></li>
            <li id="next"><a className="inline-flex rounded-md border border-[#9aa7ff] bg-[#141b48] px-3 py-1 text-white transition hover:border-white" href="#" onClick={(e) => { e.preventDefault(); onNext(); }}><span aria-hidden="true">&rarr;</span></a></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default EventsWidget;

