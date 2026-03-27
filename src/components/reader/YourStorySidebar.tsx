import { Drawer } from 'vaul';
import { useChaptrStore } from '../../store/useChaptrStore';
import SidebarContent from './SidebarContent';

export default function YourStorySidebar() {
  const sidebarOpen = useChaptrStore((s) => s.sidebarOpen);
  const toggleSidebar = useChaptrStore((s) => s.toggleSidebar);
  const decisionLog = useChaptrStore((s) => s.decisionLog);

  return (
    <>
      {/* Desktop: always visible fixed left panel */}
      <aside
        className="hidden lg:block fixed left-0 top-0 h-screen w-[280px] bg-surface border-r border-base overflow-y-auto p-6 z-30"
        role="complementary"
        aria-label="Your Story sidebar"
      >
        <SidebarContent decisionLog={decisionLog} />
      </aside>

      {/* Mobile: Vaul bottom sheet drawer */}
      <Drawer.Root
        open={sidebarOpen}
        onOpenChange={(o) => { if (!o) toggleSidebar(); }}
        snapPoints={[0.5, 1]}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 lg:hidden" />
          <Drawer.Content
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-2xl p-6 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Your Story sidebar"
          >
            <Drawer.Handle className="mx-auto mb-4 h-1 w-12 rounded-full bg-muted" />
            <SidebarContent decisionLog={decisionLog} />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
