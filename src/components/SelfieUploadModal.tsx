import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { getCroppedImg } from '../lib/cropImage';
import { useChaptrStore } from '../store/useChaptrStore';

type ModalStep = 'primer' | 'crop';

export default function SelfieUploadModal() {
  const setSelfie = useChaptrStore((s) => s.setSelfie);
  const dismissSelfiePrompt = useChaptrStore((s) => s.dismissSelfiePrompt);

  const [step, setStep] = useState<ModalStep>('primer');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [error, setError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setStep('crop');
      setError(false);
    };
    reader.readAsDataURL(file);
  }

  async function handleConfirm() {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      setSelfie(croppedBase64);
      dismissSelfiePrompt();
    } catch {
      setError(true);
    }
  }

  function handleRetry() {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError(false);
    setStep('primer');
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={dismissSelfiePrompt}
        />

        {/* Panel */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="selfie-modal-headline"
          className="relative bg-surface rounded-2xl max-w-[440px] w-full mx-4 p-8"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 'primer' && (
            <>
              <h2
                id="selfie-modal-headline"
                className="text-text-primary font-sans font-semibold text-xl text-center"
              >
                Make the story yours
              </h2>
              <p className="text-muted font-sans text-base text-center mt-4">
                Your photo stays on your device -- it's never uploaded or shared
              </p>
              <button
                className="bg-rose-accent text-[#0D0B12] font-sans text-base font-medium px-8 py-3 rounded-full w-full mt-6"
                onClick={() => fileInputRef.current?.click()}
              >
                Add Your Photo
              </button>
              <button
                className="text-muted font-sans text-sm hover:underline mt-4 mx-auto block"
                onClick={dismissSelfiePrompt}
              >
                Use an illustrated avatar instead
              </button>
              <input
                type="file"
                accept="image/*"
                capture="user"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </>
          )}

          {step === 'crop' && imageSrc && (
            <>
              <div style={{ position: 'relative', width: '100%', height: 320 }}>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 5}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              {error && (
                <p className="text-rose-accent text-sm text-center mt-2">
                  Something went wrong with that photo. Try a different one.
                </p>
              )}
              <button
                className="bg-rose-accent text-[#0D0B12] font-sans text-base font-medium px-8 py-3 rounded-full w-full mt-6"
                onClick={handleConfirm}
              >
                Use this photo
              </button>
              <button
                className="text-muted font-sans text-sm hover:underline mt-4 mx-auto block"
                onClick={handleRetry}
              >
                Choose a different photo
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
