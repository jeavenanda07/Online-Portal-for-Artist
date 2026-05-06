"use client";

interface FeaturedArtFormProps {
  func: () => void;
}

const FeaturedArtForm = ({ func }: FeaturedArtFormProps) => {
  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[600px] max-h-[90vh] overflow-y-auto bg-primary border border-[#1a2e1a]
        rounded-2xl shadow-2xl shadow-black/80">

        
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a2e1a]">
          <div>
            <h4 className="text-base font-semibold text-[#c8e6c8]">Feature an Artwork</h4>
            <p className="text-xs text-[#3a5c3a] mt-0.5">Promote artwork on the homepage</p>
          </div>
          <button
            onClick={func}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4a6a4a]
              hover:bg-background hover:text-[#c8e6c8] transition-all text-lg leading-none"
          >
            ×
          </button>
        </div>

       
        <div className="px-6 py-6 flex flex-col gap-5">
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#6b8f6b] uppercase tracking-wider">
              Artwork ID <span className="text-[#ff6b6b]">*</span>
            </label>
            <input
              type="text"
              name="ArtworkID"
              required
              placeholder="e.g. art_a1b2c3d4"
              className="w-full px-4 py-3 bg-background border border-[#1a2e1a] rounded-xl
                text-sm text-[#c8e6c8] placeholder:text-[#2a4a2a]
                focus:outline-none focus:border-[#39ff6a]/50 focus:ring-1 focus:ring-[#39ff6a]/20
                transition-all"
            />
          </div>

          {/* Featured Title */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#6b8f6b] uppercase tracking-wider">
              Featured Title
              <span className="ml-1.5 text-[#2a4a2a] normal-case tracking-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="FeaturedTitle"
              placeholder="e.g. Artist Spotlight — May 2024"
              className="w-full px-4 py-3 bg-background border border-[#1a2e1a] rounded-xl
                text-sm text-[#c8e6c8] placeholder:text-[#2a4a2a]
                focus:outline-none focus:border-[#39ff6a]/50 focus:ring-1 focus:ring-[#39ff6a]/20
                transition-all"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-[#6b8f6b] uppercase tracking-wider">
                Start Date <span className="text-[#ff6b6b]">*</span>
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 bg-background border border-[#1a2e1a] rounded-xl
                  text-sm text-[#c8e6c8]
                  focus:outline-none focus:border-[#39ff6a]/50 focus:ring-1 focus:ring-[#39ff6a]/20
                  transition-all [color-scheme:dark]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-[#6b8f6b] uppercase tracking-wider">
                End Date <span className="text-[#ff6b6b]">*</span>
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 bg-background border border-[#1a2e1a] rounded-xl
                  text-sm text-[#c8e6c8]
                  focus:outline-none focus:border-[#39ff6a]/50 focus:ring-1 focus:ring-[#39ff6a]/20
                  transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#6b8f6b] uppercase tracking-wider">
              Description <span className="text-[#ff6b6b]">*</span>
            </label>
            <textarea
              name="Description"
              required
              rows={4}
              placeholder="Describe why this artwork is being featured..."
              className="w-full px-4 py-3 bg-background border border-[#1a2e1a] rounded-xl
                text-sm text-[#c8e6c8] placeholder:text-[#2a4a2a] resize-none
                focus:outline-none focus:border-[#39ff6a]/50 focus:ring-1 focus:ring-[#39ff6a]/20
                transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1a2e1a]">
          <button
            type="button"
            onClick={func}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#6b8f6b]
              hover:bg-[#0d1a0d] hover:text-[#c8e6c8] border border-[#1a2e1a]
              hover:border-[#2a4a2a] transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold
              bg-[#39ff6a] text-[#050905] hover:bg-[#5aff80]
              transition-all shadow-lg shadow-[#39ff6a]/20"
          >
            Save & Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArtForm;