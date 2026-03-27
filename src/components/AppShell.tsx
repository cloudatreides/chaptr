import { Outlet } from 'react-router';
import { useChaptrStore } from '../store/useChaptrStore';
import SelfieUploadModal from './SelfieUploadModal';

export default function AppShell() {
  const showSelfiePrompt = useChaptrStore((s) => s.showSelfiePrompt);
  return (
    <>
      <Outlet />
      {showSelfiePrompt && <SelfieUploadModal />}
    </>
  );
}
