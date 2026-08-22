import { useParams } from 'react-router-dom';

export default function Budget() {
  const { tripId } = useParams();
  return <div>Trip Budget (Trip ID: {tripId})</div>;
}
