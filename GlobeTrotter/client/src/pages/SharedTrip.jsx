import { useParams } from 'react-router-dom';

export default function SharedTrip() {
  const { shareToken } = useParams();
  return <div>Shared Trip (Token: {shareToken})</div>;
}
