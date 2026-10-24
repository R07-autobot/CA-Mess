import React, { useState } from 'react';
import { TopicLinkReference, ResourceCostType } from '../types/ca-study';
import { 
  X, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Youtube, 
  BookOpen, 
  Scale, 
  FileText, 
  Link as LinkIcon, 
  Sparkles,
  Save,
  Tag,
  ShoppingBag,
  Gift,
  CheckCircle2
} from 'lucide-react';

interface AddTopicLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  slot: 'morning' | 'evening';
  chapterTitle: string;
  currentLinks: TopicLinkReference[];
  onSaveLinks: (updatedLinks: TopicLinkReference[]) => void;
}

export const AddTopicLinkModal: React.FC<AddTopicLinkModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  slot,
  chapterTitle,
  currentLinks,
  onSaveLinks,
}) => {
  const [links, setLinks] = useState<TopicLinkReference[]>(() =>
    (currentLinks || []).map((l) => ({
      ...l,
      costType: l.costType || 'free',
    }))
  );

  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [costType, setCostType] = useState<ResourceCostType>('free');
  const [linkType, setLinkType] = useState<TopicLinkReference['type']>('youtube');
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [priceNote, setPriceNote] = useState('');
  const [urlOrId, setUrlOrId] = useState('');

  if (!isOpen) return null;

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !urlOrId.trim()) return;

    let finalUrl = urlOrId.trim();
    let videoId: string | undefined = undefined;

    if (linkType === 'youtube') {
      if (finalUrl.includes('youtube.com/watch?v=')) {
        videoId = finalUrl.split('watch?v=')[1]?.split('&')[0];
      } else if (finalUrl.includes('youtu.be/')) {
        videoId = finalUrl.split('youtu.be/')[1]?.split('?')[0];
      } else if (!finalUrl.startsWith('http')) {
        // Assume raw YouTube ID or search term
        videoId = finalUrl;
        finalUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(finalUrl + ' CA Inter')}`;
      }
    } else if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    const newLink: TopicLinkReference = {
      id: `link_${Date.now()}`,
      title: title.trim(),
      type: linkType,
      costType,
      provider: provider.trim() || (costType === 'free' ? 'ICAI / YouTube Free' : 'Recommended Faculty / Publisher'),
      priceNote: priceNote.trim() || (costType === 'free' ? 'Free Material' : 'Paid Resource'),
      url: finalUrl,
      videoId,
    };

    const updated = [...links, newLink];
    setLinks(updated);
    setTitle('');
    setUrlOrId('');
    setProvider('');
    setPriceNote('');
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleSaveAndClose = () => {
    onSaveLinks(links);
    onClose();
  };

  const renderIcon = (type: TopicLinkReference['type']) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-400" />;
      case 'icai_sm':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'bare_act':
        return <Scale className="w-4 h-4 text-purple-400" />;
      case 'paid_batch':
        return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      case 'paid_book':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'test_series':
        return <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
      default:
        return <FileText className="w-4 h-4 text-indigo-400" />;
    }
  };

  const setQuickPreset = (
    presetCost: ResourceCostType,
    presetType: TopicLinkReference['type'],
    presetTitle: string,
    presetProvider: string,
    presetPriceNote: string,
    defaultUrl: string
  ) => {
    setCostType(presetCost);
    setLinkType(presetType);
    setTitle(presetTitle);
    setProvider(presetProvider);
    setPriceNote(presetPriceNote);
    setUrlOrId(defaultUrl);
  };

  const freeLinks = links.filter((l) => l.costType === 'free');
  const paidLinks = links.filter((l) => l.costType === 'paid');
  const displayedLinks = activeFilter === 'all' ? links : activeFilter === 'free' ? freeLinks : paidLinks;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl relative text-slate-100 p-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <LinkIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Study Resources & References</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Free & Paid Segregation
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {slot === 'morning' ? 'Morning Slot (Theory)' : 'Evening Slot (Practical)'} • {dateStr} • {chapterTitle}
            </p>
          </div>
        </div>

        {/* Existing Attached Links with Segregation Filter */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">
              Attached Resources ({links.length}):
            </span>
            <div className="flex items-center gap-1 text-[11px] bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-2 py-0.5 rounded cursor-pointer font-medium ${
                  activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({links.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('free')}
                className={`px-2 py-0.5 rounded cursor-pointer font-medium flex items-center gap-1 ${
                  activeFilter === 'free' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-emerald-300'
                }`}
              >
                <Gift className="w-2.5 h-2.5" />
                <span>Free ({freeLinks.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('paid')}
                className={`px-2 py-0.5 rounded cursor-pointer font-medium flex items-center gap-1 ${
                  activeFilter === 'paid' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                <ShoppingBag className="w-2.5 h-2.5" />
                <span>Paid ({paidLinks.length})</span>
              </button>
            </div>
          </div>

          {displayedLinks.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-500 text-center italic">
              No {activeFilter !== 'all' ? activeFilter : ''} resources attached yet for this topic. Use the presets or form below to add.
            </div>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {displayedLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="shrink-0">{renderIcon(link.type)}</div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200 truncate">{link.title}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase border shrink-0 ${
                            link.costType === 'free'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {link.costType === 'free' ? 'FREE' : 'PAID'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        {link.provider && <span className="text-slate-300 font-medium">{link.provider}</span>}
                        {link.priceNote && <span>• {link.priceNote}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      title="Open Resource URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 cursor-pointer"
                      title="Remove Link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Link Form */}
        <form onSubmit={handleAddLink} className="mt-5 pt-4 border-t border-slate-800 space-y-3">
          <span className="text-xs font-bold text-white block">Attach New Resource (Free or Paid)</span>

          {/* Quick Presets */}
          <div className="space-y-1.5 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick 1-Click Presets:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Free Presets */}
              <button
                type="button"
                onClick={() =>
                  setQuickPreset(
                    'free',
                    'youtube',
                    `YouTube: ${chapterTitle} Marathon`,
                    'Free YouTube Faculty',
                    'Free Conceptual Lecture',
                    `https://www.youtube.com/results?search_query=${encodeURIComponent(chapterTitle + ' CA Inter')}`
                  )
                }
                className="text-[10px] px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer font-medium"
              >
                + Free YouTube Marathon
              </button>

              <button
                type="button"
                onClick={() =>
                  setQuickPreset(
                    'free',
                    'icai_sm',
                    `ICAI BoS: ${chapterTitle} Official SM`,
                    'ICAI BoS Knowledge Portal',
                    'Free PDF Study Material',
                    'https://www.icai.org/post/bos-knowledge-portal'
                  )
                }
                className="text-[10px] px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer font-medium"
              >
                + Free ICAI SM Module
              </button>

              {/* Paid Presets */}
              <button
                type="button"
                onClick={() =>
                  setQuickPreset(
                    'paid',
                    'paid_batch',
                    `CA Inter ${chapterTitle} Video Batch`,
                    'Renowned Faculty Batch',
                    'Paid Fast-Track (~₹4,500)',
                    `https://www.google.com/search?q=${encodeURIComponent('CA Inter ' + chapterTitle + ' Faculty video batch')}`
                  )
                }
                className="text-[10px] px-2 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 cursor-pointer font-medium"
              >
                + Paid Faculty Batch
              </button>

              <button
                type="button"
                onClick={() =>
                  setQuickPreset(
                    'paid',
                    'paid_book',
                    `Taxmann CRACKER / Scanner: ${chapterTitle}`,
                    'Taxmann Publications',
                    'Paid Physical Book (~₹700)',
                    `https://www.google.com/search?q=${encodeURIComponent('Taxmann Cracker CA Inter ' + chapterTitle)}`
                  )
                }
                className="text-[10px] px-2 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 cursor-pointer font-medium"
              >
                + Paid Exam Scanner Book
              </button>

              <button
                type="button"
                onClick={() =>
                  setQuickPreset(
                    'paid',
                    'test_series',
                    `CA Test Series: ${chapterTitle} Evaluated Test`,
                    'CA Test Series / PrepCA',
                    'Evaluated Test Series',
                    `https://www.google.com/search?q=${encodeURIComponent('CA Test Series Inter ' + chapterTitle)}`
                  )
                }
                className="text-[10px] px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 cursor-pointer font-medium"
              >
                + Evaluated Test Series
              </button>
            </div>
          </div>

          {/* Cost Selector Pills */}
          <div>
            <label className="block text-[11px] text-slate-300 font-semibold mb-1.5">
              Resource Tier:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCostType('free')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  costType === 'free'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Gift className="w-3.5 h-3.5 text-emerald-400" />
                <span>🟢 Free Resource (ICAI / YouTube / Notes)</span>
              </button>

              <button
                type="button"
                onClick={() => setCostType('paid')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  costType === 'paid'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>💎 Paid Resource (Faculty / Book / Mock)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Category</label>
              <select
                value={linkType}
                onChange={(e) => setLinkType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="icai_sm">ICAI Official SM</option>
                <option value="youtube">YouTube Lecture</option>
                <option value="bare_act">Bare Act / Law</option>
                <option value="notes">Summary Notes</option>
                <option value="paid_batch">Faculty Video Batch</option>
                <option value="paid_book">Scanner / Practice Book</option>
                <option value="test_series">Evaluated Test Series</option>
                <option value="other">Other Reference</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] text-slate-400 mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. AS 10 PPE Full Numerical Marathon"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Provider / Faculty / Author</label>
              <input
                type="text"
                placeholder="e.g. CA Parveen Sharma / Taxmann"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Cost Note / Price</label>
              <input
                type="text"
                placeholder={costType === 'free' ? 'e.g. Free on YouTube' : 'e.g. Paid Batch (~₹6,500)'}
                value={priceNote}
                onChange={(e) => setPriceNote(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              URL or YouTube ID / Book Purchase Link
            </label>
            <input
              type="text"
              placeholder="e.g. https://youtu.be/... or https://taxmann.com/... or search term"
              value={urlOrId}
              onChange={(e) => setUrlOrId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono placeholder:text-slate-500"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={!title.trim() || !urlOrId.trim()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Add Resource to Topic</span>
            </button>
          </div>
        </form>

        {/* Modal Actions */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All Resources</span>
          </button>
        </div>
      </div>
    </div>
  );
};
