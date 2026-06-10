import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Modal, Skeleton, Tag, message } from 'antd'
import { CheckCircleOutlined, InfoCircleOutlined, SafetyCertificateOutlined, StarFilled } from '@ant-design/icons'
import HomePage from '../component/HomePage'
import Footer from '../component/Footer'
import { getProducts, getShopCategories, type ProductItem } from '../utils/request'

const pageSize = 8
const skeletonItems = Array.from({ length: pageSize }, (_, index) => index)

type ProductCardProps = {
  product: ProductItem
  index: number
  onViewDetails: (productId: number) => void
}

const ProductCard = ({ product, index, onViewDetails }: ProductCardProps) => {
  return (
    <Card
      hoverable
      className="group animate-fade-up overflow-hidden rounded-3xl border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]"
      style={{ animationDelay: `${(index % pageSize) * 80}ms`, animationDuration: '0.8s' }}
      cover={
        <div className="relative h-52 overflow-hidden">
          <img src={product.image} alt={product.name} draggable={false} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-blue-600 shadow-sm">{product.category}</div>
          {product.isHotPromotion && (
            <div className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white shadow-lg shadow-red-200">
              热促 8折
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
            <span className="flex items-center gap-1 text-sm text-amber-500">
              <StarFilled />
              {product.score}
            </span>
          </div>
          <p className="mt-2 min-h-18 text-sm leading-6 text-slate-500">{product.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Tag key={tag} className="rounded-full border-slate-200 px-2 py-1 text-slate-500">
              {tag}
            </Tag>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <div className="text-xs text-slate-400">折后展示价</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-red-500">{product.finalPrice}</span>
              <span className="mb-0.5 text-sm text-slate-400 line-through">{product.originalPrice}</span>
            </div>
            {product.isHotPromotion && <div className="mt-1 text-xs font-medium text-red-500">热促商品：折后价再享 8 折</div>}
          </div>
          <Button className="rounded-full" onClick={() => onViewDetails(product.id)}>
            查看详情
          </Button>
        </div>
      </div>
    </Card>
  )
}

const Shop = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<string[]>(['全部'])
  const [activeCategory, setActiveCategory] = useState('全部')
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const [isLoading, setIsLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [guideOpen, setGuideOpen] = useState(false)
  const [products, setProducts] = useState<ProductItem[]>([])
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const productsSectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchCategories = async () => {
      try {
        const response = await getShopCategories()
        if (!cancelled) {
          setCategories(response.data.data)
        }
      } catch {
        if (!cancelled) {
          setCategories(['全部'])
        }
      }
    }

    void fetchCategories()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const fetchProducts = async () => {
      setInitialLoading(true)
      try {
        const response = await getProducts(activeCategory)
        if (!cancelled) {
          setProducts(response.data.data)
        }
      } catch {
        if (!cancelled) {
          message.error('商品数据加载失败，请稍后重试')
          setProducts([])
        }
      } finally {
        if (!cancelled) {
          setVisibleCount(pageSize)
          setInitialLoading(false)
        }
      }
    }

    void fetchProducts()

    return () => {
      cancelled = true
    }
  }, [activeCategory])

  const visibleProducts = useMemo(() => products.slice(0, visibleCount), [products, visibleCount])
  const hasMore = visibleCount < products.length

  const loadMore = () => {
    if (isLoading || !hasMore) {
      return
    }

    setIsLoading(true)
    window.setTimeout(() => {
      setVisibleCount((count) => Math.min(count + pageSize, products.length))
      setIsLoading(false)
    }, 500)
  }

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  useEffect(() => {
    const target = loadMoreRef.current

    if (!target) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '240px' },
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [hasMore, isLoading, products.length])

  return (
    <div className="min-h-screen bg-slate-50">
      <HomePage />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-52 w-52 rounded-full bg-blue-900/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <Tag className="mb-5 rounded-full border-white/30 bg-white/20 px-4 py-1 text-white backdrop-blur">ZhiKang 健康商城</Tag>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">精选营养保健品展示，守护你的日常健康管理</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/85">
              本页面仅展示保健食品、营养补充剂、钙片等健康产品信息。平台严格禁止售卖处方药、治疗类药品及任何需医疗许可销售的药品。
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="large" type="primary" className="h-12 rounded-full bg-slate-900 px-8 hover:bg-slate-800" onClick={scrollToProducts}>
                浏览健康产品
              </Button>
              <Button
                size="large"
                className="h-12 rounded-full border-white/40 bg-white/15 px-8 text-white backdrop-blur hover:border-white hover:bg-white/25"
                onClick={() => setGuideOpen(true)}
              >
                查看选购说明
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-900 shadow-sm">
            <div className="flex items-start gap-3">
              <SafetyCertificateOutlined className="mt-1 text-xl" />
              <div>
                <div className="font-semibold">合规声明</div>
                <p className="mt-1 leading-7">商城仅用于展示和推荐营养健康类产品，不提供药品交易服务。产品不能替代药物治疗，如有疾病或用药需求，请咨询专业医生或药师。</p>
              </div>
            </div>
          </div>
        </section>

        <section ref={productsSectionRef} className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-16">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">健康产品展示</h2>
              <p className="mt-2 text-slate-500">覆盖维生素、钙片、蛋白营养与益生菌等日常保健场景，向下滚动自动加载更多</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeCategory === category ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {initialLoading &&
              skeletonItems.map((item) => (
                <Card key={item} className="overflow-hidden rounded-3xl border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                  <Skeleton.Image active className="!h-52 !w-full" />
                  <div className="space-y-4 pt-4">
                    <Skeleton active paragraph={{ rows: 3 }} title={{ width: '70%' }} />
                    <div className="flex gap-2">
                      <Skeleton.Button active size="small" shape="round" />
                      <Skeleton.Button active size="small" shape="round" />
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <Skeleton.Input active size="small" className="!w-24" />
                      <Skeleton.Button active shape="round" />
                    </div>
                  </div>
                </Card>
              ))}

            {!initialLoading && visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} onViewDetails={(productId) => navigate(`/shop/product/${productId}`)} />)}
          </div>

          <div ref={loadMoreRef} className="py-8 text-slate-500">
            {isLoading && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {skeletonItems.map((item) => (
                  <Card key={item} className="overflow-hidden rounded-3xl border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                    <Skeleton.Image active className="!h-52 !w-full" />
                    <div className="space-y-4 pt-4">
                      <Skeleton active paragraph={{ rows: 3 }} title={{ width: '70%' }} />
                      <div className="flex gap-2">
                        <Skeleton.Button active size="small" shape="round" />
                        <Skeleton.Button active size="small" shape="round" />
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <Skeleton.Input active size="small" className="!w-24" />
                        <Skeleton.Button active shape="round" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            {!isLoading && hasMore && <div className="flex min-h-24 items-center justify-center">继续向下滚动加载更多</div>}
            {!hasMore && <div className="flex min-h-24 items-center justify-center">已展示本站全部健康产品</div>}
          </div>
        </section>
      </main>

      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-900">
            <InfoCircleOutlined className="text-blue-600" />
            健康产品选购说明
          </div>
        }
        open={guideOpen}
        footer={null}
        centered
        width={720}
        onCancel={() => setGuideOpen(false)}
      >
        <div className="space-y-5 pt-2 text-slate-600">
          <div className="rounded-2xl bg-blue-50 p-4 text-blue-900">
            本商城仅展示保健食品、营养补充剂、钙片、维生素、益生菌等健康产品信息，不售卖处方药、治疗类药品或需医疗许可销售的药品。
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              '优先根据自身年龄、饮食结构、运动情况选择营养补充品。',
              '关注产品标签中的适用人群、食用方法、过敏原与注意事项。',
              '保健食品不能替代药物治疗，身体不适时请及时就医。',
              '孕妇、儿童、慢病人群或正在用药者，建议先咨询医生或药师。',
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <CheckCircleOutlined className="mt-1 text-green-500" />
                <span className="leading-7">{item}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            温馨提示：页面中的价格为展示参考价，热促折扣仅用于页面展示效果；如涉及实际购买，应以合规平台、产品资质和专业建议为准。
          </div>

          <div className="flex justify-end">
            <Button type="primary" className="rounded-full px-6" onClick={() => setGuideOpen(false)}>
              我已了解
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}

export default Shop
