import React from 'react';

function EventsWidget({ events, onPrev, onNext, loading, error }) {
  return (
    <div id="events-panel" className="panel panel-primary">
      <div className="panel-heading">
        <h3 className="panel-title">Events</h3>
      </div>
      <div className="panel-body">
        {error && <p>Error: {error}</p>}
        <div id="events" className="list-group">
          {events.map((event, index) => (
            <div key={index} className="list-group-item">
              <h4 className="list-group-item-heading">{event.name}</h4>
              <p className="list-group-item-text">{event.dates?.start?.localDate || 'Date not available'}</p>
              <p className="venue">
                {event._embedded?.venues?.[0] ? `${event._embedded.venues[0].name} in ${event._embedded.venues[0].city?.name || ''}` : 'Venue not available'}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="panel-footer">
        <nav>
          <ul className="pager">
            <li id="prev" className="previous"><a href="#" onClick={(e) => { e.preventDefault(); onPrev(); }}><span aria-hidden="true">&larr;</span></a></li>
            <li id="next" className="next"><a href="#" onClick={(e) => { e.preventDefault(); onNext(); }}><span aria-hidden="true">&rarr;</span></a></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default EventsWidget;

