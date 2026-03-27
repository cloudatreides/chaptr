function App() {
  return (
    <div className="min-h-screen bg-base">
      <div className="page-container px-5 py-10">
        <h1 className="font-sans text-3xl font-bold text-text-primary mb-8">
          Chaptr — Design System Smoke Test
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="h-16 rounded bg-base border border-muted flex items-center justify-center">
            <span className="text-xs text-muted">base</span>
          </div>
          <div className="h-16 rounded bg-surface flex items-center justify-center">
            <span className="text-xs text-muted">surface</span>
          </div>
          <div className="h-16 rounded bg-rose-accent flex items-center justify-center">
            <span className="text-xs text-base">rose-accent</span>
          </div>
          <div className="h-16 rounded bg-purple-accent flex items-center justify-center">
            <span className="text-xs text-base">purple-accent</span>
          </div>
          <div className="h-16 rounded bg-gold flex items-center justify-center">
            <span className="text-xs text-base">gold</span>
          </div>
          <div className="h-16 rounded bg-text-primary flex items-center justify-center">
            <span className="text-xs text-base">text-primary</span>
          </div>
          <div className="h-16 rounded bg-muted flex items-center justify-center">
            <span className="text-xs text-base">muted</span>
          </div>
        </div>
        <p className="text-muted text-sm">
          Font: Space Grotesk Variable. If this text is not in a geometric sans-serif, the font import is broken.
        </p>
      </div>
    </div>
  )
}

export default App
