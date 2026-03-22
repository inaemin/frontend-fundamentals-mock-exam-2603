import { useNavigate } from 'react-router-dom';
import { MessageState } from 'pages/types';

export function useNavigateWithMessage() {
  const navigate = useNavigate();
  return (path: string, state: MessageState) => navigate(path, { state });
}
