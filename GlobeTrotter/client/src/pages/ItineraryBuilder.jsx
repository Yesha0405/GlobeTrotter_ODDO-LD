import { useParams } from 'react-router-dom';

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  return <div>Build Itinerary (Trip ID: {tripId})</div>;
}
