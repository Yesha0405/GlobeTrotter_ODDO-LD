import { useParams } from 'react-router-dom';

export default function Timeline() {
  const { tripId } = useParams();
  return <div>Itinerary Timeline (Trip ID: {tripId})</div>;
}
