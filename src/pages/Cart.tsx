import { useMemo, useState } from 'react'
import { Button, Card, Divider, InputNumber, Tag } from 'antd'
import { ArrowLeftOutlined, DeleteOutlined, SafetyCertificateOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import HomePage from '../component/HomePage'
import Footer from '../component/Footer'

interface CartItem {
  id: number
  name: string
  category: string
  originalPrice: number
  discountedPrice: number
  quantity: number
  image: string
  isHotPromotion?: boolean
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: '成人复合维生素营养片',
    category: '维生素',
    originalPrice: 89,
    discountedPrice: 76,
    quantity: 1,
    image: 'https://picsum.photos/seed/cart-vitamin/400/400',
    isHotPromotion: true,
  },
  {
    id: 2,
    name: '中老年钙维D营养片',
    category: '钙片',
    originalPrice: 128,
    discountedPrice: 109,
    quantity: 2,
    image: 'https://picsum.photos/seed/cart-calcium/400/400',
  },
]

const Cart = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState(initialCartItems)

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0),
    [items],
  )

  const originalTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0),
    [items],
  )

  const updateQuantity = (id: number, quantity: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <HomePage />

      <main className="mx-auto max-w-7xl overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
        <button className="mb-4 flex items-center gap-2 text-slate-500 transition hover:text-blue-600" onClick={() => navigate('/shop')}>
          <ArrowLeftOutlined />
          返回商城
        </button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="mb-5 flex items-center gap-3">
              <ShoppingCartOutlined className="text-xl text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">购物车</h1>
                <p className="text-sm text-slate-500">仅展示健康营养类商品，不包含处方药与治疗类药品</p>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-slate-500">
                购物车暂无商品，去商城挑选健康营养产品吧。
                <div className="mt-4">
                  <Button type="primary" onClick={() => navigate('/shop')}>去逛商城</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <img src={item.image} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Tag color="blue">{item.category}</Tag>
                          {item.isHotPromotion && <Tag color="red">热促 8折</Tag>}
                          <Tag color="green">非药品</Tag>
                        </div>
                        <div className="mt-2 text-lg font-semibold text-slate-900">{item.name}</div>
                        <div className="mt-2 flex flex-wrap items-end gap-2">
                          <span className="text-2xl font-bold text-red-500">¥{item.discountedPrice}</span>
                          <span className="text-sm text-slate-400 line-through">¥{item.originalPrice}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <InputNumber min={1} max={9} value={item.quantity} onChange={(value) => updateQuantity(item.id, value ?? 1)} className="w-full sm:w-28" />
                        <Button danger icon={<DeleteOutlined />} onClick={() => removeItem(item.id)} className="w-full sm:w-auto">
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="space-y-6">
            <Card className="rounded-3xl border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="mb-4 text-lg font-semibold text-slate-900">结算信息</div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>商品原价</span>
                  <span>¥{originalTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>折后总价</span>
                  <span className="font-semibold text-red-500">¥{totalPrice}</span>
                </div>
                <Divider className="my-4" />
                <div className="flex justify-between text-base font-semibold text-slate-900">
                  <span>应付金额</span>
                  <span>¥{totalPrice}</span>
                </div>
              </div>
              <Button type="primary" block size="large" className="mt-5 h-12 rounded-2xl bg-slate-900 hover:bg-blue-700" onClick={() => navigate('/pay')}>
                去结算
              </Button>
            </Card>

            <Card className="rounded-3xl border-amber-200 bg-amber-50 shadow-none">
              <div className="flex items-start gap-3 text-amber-900">
                <SafetyCertificateOutlined className="mt-1 text-xl" />
                <div className="text-sm leading-7">
                  购物车中的商品仅为健康营养类展示品，不提供药品交易服务。请在购买前确认适用人群、食用说明和注意事项。
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Cart
