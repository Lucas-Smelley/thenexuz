export default function BloodBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-20 left-10 w-24 h-24 bg-red-600 rounded-full opacity-30 blur-sm animate-splatter" />
      <div className="absolute top-32 right-20 w-16 h-16 bg-red-600 rounded-full opacity-25 blur-sm animate-splatter" />
      <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-red-600 rounded-full opacity-20 blur-sm animate-splatter" />
      <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-red-700 rounded-full opacity-25 animate-splatter" />
    </div>
  )
}
