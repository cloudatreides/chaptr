import { Drawer } from 'vaul';

type GemGateSheetProps = {
  open: boolean;
  onClose: () => void;
  gemCost: number;
  currentBalance: number;
};

export default function GemGateSheet({
  open,
  onClose,
  gemCost,
  currentBalance,
}: GemGateSheetProps) {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={(o) => !o && onClose()}
      snapPoints={[0.5, 1]}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-2xl p-6 z-50">
          <Drawer.Handle className="mx-auto mb-4 h-1 w-12 rounded-full bg-muted" />
          <div className="text-center">
            <span className="text-gold text-[32px]">&#10022;</span>
            <h3 className="text-text-primary text-xl font-semibold mt-4">
              Not enough gems
            </h3>
            <p className="text-muted text-base mt-2">
              You need {gemCost} gems to unlock this choice. You have{' '}
              {currentBalance} gems.
            </p>
            <button className="mt-6 w-full rounded-full bg-gold px-6 py-3 text-base font-semibold text-[#0D0B12]">
              Get More Gems
            </button>
            <button className="mt-3 text-muted text-sm" onClick={onClose}>
              Maybe later
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
