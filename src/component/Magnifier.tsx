import { useRef, useState } from 'react'

interface MagnifierProps {
  images: string[]
  alt: string
}

const lensSize = 112

const Magnifier = ({ images, alt }: MagnifierProps) => {
  const imageRef = useRef<HTMLDivElement | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [lensVisible, setLensVisible] = useState(false)
  const [lensPosition, setLensPosition] = useState({ x: 50, y: 50 })
  const activeImage = images[activeImageIndex]

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = imageRef.current?.getBoundingClientRect()

    if (!rect) {
      return
    }

    const halfLens = lensSize / 2
    const x = Math.min(Math.max(event.clientX - rect.left, halfLens), rect.width - halfLens)
    const y = Math.min(Math.max(event.clientY - rect.top, halfLens), rect.height - halfLens)
    setLensPosition({ x, y })
  }

  return (
    <div className="relative mx-auto w-full max-w-[360px] lg:mx-0">
      <div>
        <div
          ref={imageRef}
          className="relative aspect-square w-full cursor-crosshair overflow-hidden rounded-3xl bg-white"
          onMouseEnter={() => setLensVisible(true)}
          onMouseLeave={() => setLensVisible(false)}
          onMouseMove={handleMouseMove}
        >
          <img src={activeImage} alt={alt} className="h-full w-full object-cover" />
          {lensVisible && (
            <div
              className="pointer-events-none absolute h-28 w-28 -translate-x-1/2 -translate-y-1/2 border-2 border-white/90 bg-white/20 shadow-[0_0_0_999px_rgba(15,23,42,0.12)] backdrop-blur-[1px]"
              style={{ left: lensPosition.x, top: lensPosition.y }}
            />
          )}
        </div>

        <div className="mt-4 flex w-full justify-center gap-2 sm:gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              className={`h-14 w-14 overflow-hidden rounded-2xl border-2 bg-white p-1 transition sm:h-16 sm:w-16 ${
                activeImageIndex === index ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-slate-200 hover:border-blue-300'
              }`}
              onClick={() => setActiveImageIndex(index)}
            >
              <img src={image} alt={`商品缩略图${index + 1}`} className="h-full w-full rounded-xl object-cover" />
            </button>
          ))}
        </div>

        <div className="mt-4 w-full text-center text-xs text-slate-500 sm:text-sm">将鼠标移入商品图，可在图片右侧查看局部放大效果</div>
      </div>

      <div
        className={`pointer-events-none absolute left-[calc(100%+4px)] top-0 z-30 hidden h-[220px] w-[220px] rounded-3xl border border-blue-100 bg-white bg-no-repeat shadow-[0_18px_50px_rgba(15,23,42,0.16)] transition-opacity xl:block ${lensVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundImage: `url(${activeImage})`,
          backgroundSize: '220%',
          backgroundPosition: imageRef.current
            ? `${(lensPosition.x / imageRef.current.clientWidth) * 100}% ${(lensPosition.y / imageRef.current.clientHeight) * 100}%`
            : '50% 50%',
        }}
      />
    </div>
  )
}

export default Magnifier
