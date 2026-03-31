import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { getCroppedImg } from '../lib/cropImage';
import { useChaptrStore } from '../store/useChaptrStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const selfieUrl = useChaptrStore((s) => s.selfieUrl);
  const userName = useChaptrStore((s) => s.userName);
  const userBio = useChaptrStore((s) => s.userBio);
  const setSelfie = useChaptrStore((s) => s.setSelfie);
  const setUserName = useChaptrStore((s) => s.setUserName);
  const setUserBio = useChaptrStore((s) => s.setUserBio);

  const [nameInput, setNameInput] = useState(userName ?? '');
  const [bioInput, setBioInput] = useState(userBio ?? '');
  const [saved, setSaved] = useState(false);

  // Photo crop flow
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropError, setCropError] = useState(false);
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
      setCropError(false);
    };
    reader.readAsDataURL(file);
  }

  async function handleCropConfirm() {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      setSelfie(croppedBase64);
      setImageSrc(null);
    } catch {
      setCropError(true);
    }
  }

  function handleCropCancel() {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCropError(false);
  }

  function handleSave() {
    if (nameInput.trim()) setUserName(nameInput.trim());
    setUserBio(bioInput.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen bg-base">
      <div className="page-container">
        <div className="max-w-[480px] mx-auto px-5 py-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-muted hover:text-text-primary transition-colors text-sm font-sans"
            >
              ← Back
            </button>
            <h1 className="text-text-primary font-sans font-semibold text-xl">Your Profile</h1>
          </div>

          {/* Photo section */}
          <div className="mb-8">
            <p className="text-muted text-xs font-sans uppercase tracking-widest mb-4">Photo</p>

            {imageSrc ? (
              /* Crop UI */
              <div className="bg-surface rounded-2xl p-4">
                <div style={{ position: 'relative', width: '100%', height: 300 }}>
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
                {cropError && (
                  <p className="text-rose-accent text-sm text-center mt-3">
                    Something went wrong. Try a different photo.
                  </p>
                )}
                <div className="flex gap-3 mt-4">
                  <button
                    className="flex-1 bg-rose-accent text-[#0D0B12] font-sans text-sm font-medium py-2.5 rounded-full"
                    onClick={handleCropConfirm}
                  >
                    Use this photo
                  </button>
                  <button
                    className="flex-1 border border-muted/30 text-muted font-sans text-sm py-2.5 rounded-full hover:border-muted/60 transition-colors"
                    onClick={handleCropCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                {/* Current portrait */}
                {selfieUrl ? (
                  <div className="w-[80px] h-[100px] rounded-2xl border-2 border-rose-accent/40 overflow-hidden flex-shrink-0">
                    <img src={selfieUrl} alt="Your photo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-[80px] h-[100px] rounded-2xl border-2 border-muted/20 bg-surface flex items-center justify-center flex-shrink-0">
                    <span className="text-muted text-3xl">👤</span>
                  </div>
                )}
                <div>
                  <button
                    className="bg-surface border border-muted/30 text-text-primary font-sans text-sm font-medium px-5 py-2.5 rounded-full hover:border-rose-accent/40 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selfieUrl ? 'Change photo' : 'Add photo'}
                  </button>
                  <p className="text-muted text-xs font-sans mt-2">Stays on your device only</p>
                </div>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              capture="user"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Name */}
          <div className="mb-6">
            <label className="text-muted text-xs font-sans uppercase tracking-widest block mb-3">
              Name
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              maxLength={32}
              className="w-full bg-surface border border-muted/20 text-text-primary font-sans text-base px-4 py-3 rounded-xl outline-none focus:border-rose-accent/50 transition-colors placeholder:text-muted/50"
            />
          </div>

          {/* Bio */}
          <div className="mb-8">
            <label className="text-muted text-xs font-sans uppercase tracking-widest block mb-3">
              Bio
            </label>
            <textarea
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              placeholder="Add a short bio for your character…"
              maxLength={160}
              rows={3}
              className="w-full bg-surface border border-muted/20 text-text-primary font-sans text-base px-4 py-3 rounded-xl outline-none focus:border-rose-accent/50 transition-colors placeholder:text-muted/50 resize-none"
            />
            <p className="text-muted/50 text-xs font-sans text-right mt-1">{bioInput.length}/160</p>
          </div>

          {/* Save */}
          <button
            className="w-full bg-rose-accent text-[#0D0B12] font-sans text-base font-medium py-3 rounded-full hover:opacity-90 transition-opacity"
            onClick={handleSave}
          >
            {saved ? 'Saved ✓' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
