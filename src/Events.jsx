import { useState, useEffect, useCallback } from 'react';
import EventsWidget from './EventsWidget.jsx';
import './App.css';

function Events({ artistName }) {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;

  const fetchEvents = useCallback(async (currentPage, query = '') => {
    setLoading(true);
    setError(null);
    try {
      let url;
      if (query) {
        // First, search for attractions by artist name
        const attractionUrl = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${encodeURIComponent(query)}&apikey=${apiKey}`;
        const attractionResponse = await fetch(attractionUrl);
        if (!attractionResponse.ok) {
          throw new Error('Failed to fetch attractions');
        }
        const attractionData = await attractionResponse.json();
        if (attractionData._embedded && attractionData._embedded.attractions && attractionData._embedded.attractions.length > 0) {
          const attractionId = attractionData._embedded.attractions[0].id;
          // Now fetch events for this attraction
          url = `https://app.ticketmaster.com/discovery/v2/events.json?attractionId=${attractionId}&size=4&page=${currentPage}&apikey=${apiKey}`;
        } else {
          setEvents([]);
          setTotalPages(0);
          setLoading(false);
          return;
        }
      } else {
        url = `https://app.ticketmaster.com/discovery/v2/events.json?size=4&page=${currentPage}&apikey=${apiKey}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      console.log(data); // As per the provided code
      if (data._embedded && data._embedded.events) {
        setEvents(data._embedded.events);
        setTotalPages(data.page.totalPages);
      } else {
        setEvents([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    if (!artistName || !artistName.trim()) {
      setEvents([]);
      setError(null);
      setLoading(false);
      setTotalPages(0);
      return;
    }

    fetchEvents(page, artistName);
  }, [page, artistName, fetchEvents]);

  useEffect(() => {
    setPage(0);
  }, [artistName]);

  const handlePrev = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  if (!artistName || !artistName.trim()) {
    return <h2>Please enter an artist name to see events.</h2>;
  }

  return (
    <div>
      <EventsWidget
        events={events}
        onPrev={handlePrev}
        onNext={handleNext}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default Events;