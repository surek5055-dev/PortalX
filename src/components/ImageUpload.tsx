import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { uploadImage } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';

interface Props {
  value: string;
  onChange: (url: string) => void;
  kind?: string;
  label?: string;
  className?: string;
  rounded?: boolean;
}

export default function ImageUpload({ value, onChange, kind = 'misc', label = 'Image', className = '', rounded = false }: Props) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handle = async (file?: File) => {
    if (!file || !user) return;
    setBusy(true);
    const url = await uploadImage(file, user.id, kind);
    setBusy(false);
    if (url) onChange(url);
  };

  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <div
        className={`relative border-2 border-dashed rounded-2xl overflow-hidden group cursor-pointer transition-colors ${rounded ? 'aspect-square w-32' : 'aspect-video w-full'}`}
        style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface-2))' }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handle(e.dataTransfer.files?.[0]); }}
      >
        {value ? (
          <>
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button type="button" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} className="btn btn-ghost !bg-white/90 text-xs">
                <ImagePlus size={14} /> Replace
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); onChange(''); }} className="btn btn-danger text-xs">
                <X size={14} />
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[rgb(var(--text-faint))]">
            {busy ? <Loader2 size={22} className="animate-spin" /> : <ImagePlus size={26} />}
            <span className="text-xs font-medium">{busy ? 'Uploading...' : 'Click or drag to upload'}</span>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handle(e.target.files?.[0])} />
      </div>
    </div>
  );
}
