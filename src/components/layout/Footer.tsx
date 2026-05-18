export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-lg font-semibold text-brand-600">Talent<span className="text-gray-400 font-normal">AI</span></span>
          <p className="text-xs text-gray-400 mt-1">AI-powered job matching · Built with Next.js + Claude AI</p>
        </div>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} TalentAI</p>
      </div>
    </footer>
  )
}
