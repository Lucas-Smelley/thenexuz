export default function SceneTape({
  text,
  position,
  rotation,
}: {
  text: string
  position: 'top' | 'bottom'
  rotation?: string
}) {
  const defaultRotation = position === 'top' ? '-rotate-2' : 'rotate-2'
  const translate = position === 'top' ? '-translate-y-4' : 'translate-y-4'
  const posClass = position === 'top' ? 'top-0' : 'bottom-0'

  return (
    <div className={`absolute ${posClass} left-0 w-full h-16 bg-red-800 transform ${rotation ?? defaultRotation} ${translate} z-10`}>
      <div className="flex items-center justify-center h-full">
        <div
          className="flex items-center space-x-8 text-yellow-200 font-bold text-lg tracking-wider"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        >
          <span>⚠️ {text} ⚠️</span>
          <span>⚠️ {text} ⚠️</span>
          <span>⚠️ {text} ⚠️</span>
        </div>
      </div>
    </div>
  )
}
