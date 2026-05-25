import { useMemo, useState } from 'react'
import { Button, Card, InputNumber, Tag } from 'antd'
import { ArrowLeftOutlined, SafetyCertificateOutlined, ShoppingCartOutlined, StarFilled } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import HomePage from '../component/HomePage'
import Magnifier from '../component/Magnifier'

const productNames = ['成人复合维生素营养片', '中老年钙维D营养片', '高蛋白营养粉', '益生菌冻干粉', '蓝莓叶黄素酯片']

const ProductDetails = () => {
  const navigate = useNavigate()
  const { id = '1' } = useParams()
  const productId = Number(id) || 1
  const productIndex = (productId - 1) % productNames.length
  const productImages = useMemo(
    () => Array.from({ length: 4 }, (_, index) => `https://picsum.photos/seed/product-detail-${productId}-${index}/1000/1000`),
    [productId],
  )
  const [quantity, setQuantity] = useState(1)
  const [selectedSpec, setSelectedSpec] = useState('标准装')

  const product = useMemo(() => {
    const originalPrice = 128 + productIndex * 20
    const discountPrice = Math.round(originalPrice * 0.85)

    return {
      name: productNames[productIndex],
      category: ['维生素', '钙片', '蛋白营养', '益生菌', '日常保健'][productIndex],
      originalPrice: `¥${originalPrice}`,
      price: `¥${discountPrice}`,
      score: (4.7 + productIndex * 0.05).toFixed(1),
      tags: ['营养补充', '非药品', '健康管理'],
      description: '精选健康营养补充产品，适合日常健康管理场景。产品不具备疾病治疗功能，不能替代药物使用。',
    }
  }, [productIndex])

  return (
    <div className="min-h-screen bg-white">
      <HomePage />

      <main className="w-full overflow-x-hidden bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
        <button className="mb-4 flex items-center gap-2 transition hover:text-blue-600" onClick={() => navigate('/shop')}>
          <ArrowLeftOutlined />
          返回健康商城
        </button>

        <Card className="rounded-3xl border-white bg-white shadow-none">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,450px)_minmax(340px,1fr)]">
            <Magnifier images={productImages} alt={product.name} />

            <div>
              <div className="flex flex-wrap gap-2">
                <Tag color="blue">{product.category}</Tag>
                <Tag color="red">限时折扣</Tag>
                <Tag color="green">非药品</Tag>
              </div>

              <h1 className="mt-4 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{product.name}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">{product.description}</p>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-amber-500">
                <StarFilled />
                <span className="font-semibold">{product.score}</span>
                <span className="text-slate-400">｜ 98% 用户好评 ｜ 健康营养展示品</span>
              </div>

              <div className="mt-6 rounded-3xl bg-red-50 p-5">
                <div className="text-sm text-slate-500">折后展示价</div>
                <div className="mt-2 flex items-end gap-3">
                  <span className="text-3xl font-bold text-red-500 sm:text-4xl">{product.price}</span>
                  <span className="pb-1 text-base text-slate-400 line-through">{product.originalPrice}</span>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="mb-3 font-medium text-slate-800">选择规格</div>
                  <div className="flex flex-wrap gap-3">
                    {['标准装', '家庭装', '便携装'].map((spec) => (
                      <button
                        key={spec}
                        className={`rounded-2xl border px-5 py-2 transition ${selectedSpec === spec ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'}`}
                        onClick={() => setSelectedSpec(spec)}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 font-medium text-slate-800">购买数量</div>
                  <InputNumber min={1} max={9} value={quantity} onChange={(value) => setQuantity(value ?? 1)} />
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
                  <SafetyCertificateOutlined className="mr-2" />
                  本页面仅用于健康营养产品详情展示，不销售处方药或治疗类药品。产品不能替代药物治疗。
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="large" type="primary" icon={<ShoppingCartOutlined />} className="h-12 flex-1 rounded-2xl bg-slate-900 hover:bg-blue-700" onClick={() => navigate('/cart')}>
                    加入购物车
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
        </div>
      </main>

    </div>
  )
}

export default ProductDetails
