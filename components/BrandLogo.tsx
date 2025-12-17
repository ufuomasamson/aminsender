export default function BrandLogo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center">
      <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="mr-2">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#g)" />
        <path d="M9 16c4 0 6-4 7-4s3 4 7 4-4 6-7 6-8-6-7-6z" fill="#fff" opacity="0.9" />
      </svg>
      <span className="text-2xl font-bold text-gray-900">AminSender</span>
    </div>
  )
}

