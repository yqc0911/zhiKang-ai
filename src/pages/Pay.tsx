import { useMemo, useState } from 'react'
import { Button, Card, Divider, Form, Input, Modal, Radio, Tag, message } from 'antd'
import { ArrowLeftOutlined, CheckCircleOutlined, CreditCardOutlined, DeleteOutlined, FormOutlined, PlusOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import HomePage from '../component/HomePage'
import Footer from '../component/Footer'

// 收货地址类型定义
interface AddressItem {
  id: string
  label: string
  detail: string
}

// 初始地址数据
const initialAddresses: AddressItem[] = [
  { id: 'addr-1', label: '默认地址', detail: '上海市浦东新区张江高科技园区 88 号 10 幢 502 室' },
  { id: 'addr-2', label: '家用地址', detail: '北京市朝阳区望京街道望京 SOHO T3 1208 室' },
  { id: 'addr-3', label: '公司地址', detail: '广州市天河区科韵路 31 号 A 座 1806 室' },
]

const Pay = () => {
  const navigate = useNavigate()

  // 支付方式
  const [paymentMethod, setPaymentMethod] = useState<'alipay' | 'wechat' | 'card'>('alipay')
  // 付款人信息
  const [payerName, setPayerName] = useState('')
  const [phone, setPhone] = useState('')

  // 地址管理状态
  const [selectedAddressId, setSelectedAddressId] = useState(initialAddresses[0].id)
  const [addresses, setAddresses] = useState<AddressItem[]>(initialAddresses)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressLabel, setAddressLabel] = useState('')
  const [addressDetail, setAddressDetail] = useState('')

  // 当前选中的收货地址
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? addresses[0]

  // 订单明细
  const orderSummary = useMemo(
    () => [
      { name: '成人复合维生素营养片', count: 1, price: 76 },
      { name: '中老年钙维D营养片', count: 2, price: 109 },
    ],
    [],
  )

  // 总金额
  const total = useMemo(() => orderSummary.reduce((sum, item) => sum + item.price * item.count, 0), [orderSummary])

  // 打开新增地址弹窗
  const openAddAddress = () => {
    setEditingAddressId(null)
    setAddressLabel('')
    setAddressDetail('')
    setAddressModalOpen(true)
  }

  // 打开编辑地址弹窗
  const openEditAddress = (address: AddressItem) => {
    setEditingAddressId(address.id)
    setAddressLabel(address.label)
    setAddressDetail(address.detail)
    setAddressModalOpen(true)
  }

  // 关闭地址弹窗并清空编辑状态
  const closeAddressModal = () => {
    setAddressModalOpen(false)
    setEditingAddressId(null)
    setAddressLabel('')
    setAddressDetail('')
  }

  // 保存地址信息
  const saveAddress = () => {
    const nextLabel = addressLabel.trim()
    const nextDetail = addressDetail.trim()

    if (!nextLabel || !nextDetail) {
      message.warning('请填写完整的地址信息')
      return
    }

    if (editingAddressId) {
      setAddresses((prev) => prev.map((item) => (item.id === editingAddressId ? { ...item, label: nextLabel, detail: nextDetail } : item)))
      message.success('地址已更新')
    } else {
      const nextId = `addr-${Date.now()}`
      const newAddress = { id: nextId, label: nextLabel, detail: nextDetail }
      setAddresses((prev) => [newAddress, ...prev])
      setSelectedAddressId(nextId)
      message.success('地址已添加')
    }

    closeAddressModal()
  }

  // 删除地址
  const removeAddress = (id: string) => {
    const target = addresses.find((item) => item.id === id)
    if (!target) return

    Modal.confirm({
      title: '删除地址',
      content: `确认删除“${target.label}”吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        setAddresses((prev) => {
          const nextAddresses = prev.filter((item) => item.id !== id)
          if (selectedAddressId === id) {
            setSelectedAddressId(nextAddresses[0]?.id ?? '')
          }
          return nextAddresses
        })
        message.success('地址已删除')
      },
    })
  }

  // 提交支付
  const handlePay = () => {
    if (!payerName || !phone || !selectedAddress) {
      message.warning('请先完善付款人信息和收货地址')
      return
    }

    message.success('模拟支付成功')
    navigate('/shop')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <HomePage />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <button className="mb-4 flex items-center gap-2 text-slate-500 transition hover:text-blue-600" onClick={() => navigate('/cart')}>
          <ArrowLeftOutlined />
          返回购物车
        </button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="mb-5 flex items-center gap-3">
              <CreditCardOutlined className="text-xl text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">健康营养商品支付</h1>
                <p className="text-sm text-slate-500">仅支持健康营养类商品的模拟支付流程，不涉及药品交易</p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="font-semibold text-slate-900">订单信息</div>
                <Tag color="green">非药品</Tag>
              </div>
              <div className="space-y-4">
                {orderSummary.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <div>
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-sm text-slate-500">数量：{item.count}</div>
                    </div>
                    <div className="text-right font-semibold text-slate-900">¥{item.price * item.count}</div>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 text-sm font-medium text-slate-700">付款人姓名</div>
                <Input value={payerName} onChange={(e) => setPayerName(e.target.value)} placeholder="请输入付款人姓名" />
              </div>
              <div>
                <div className="mb-2 text-sm font-medium text-slate-700">联系电话</div>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="请输入联系电话" maxLength={11} />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between text-sm font-medium text-slate-700">
                <span>收货地址</span>
                <Button type="link" icon={<PlusOutlined />} className="px-0" onClick={openAddAddress}>
                  新增地址
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-900">{selectedAddress.label}</span>
                    {addresses[0]?.id === selectedAddress.id && <Tag color="blue" className="mr-0">默认</Tag>}
                    <Tag color="green" className="mr-0">已选中</Tag>
                  </div>
                  <div className="mt-2 text-sm leading-6 text-slate-500">{selectedAddress.detail}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="small" icon={<FormOutlined />} onClick={() => openEditAddress(selectedAddress)}>
                    修改
                  </Button>
                  <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeAddress(selectedAddress.id)}>
                    删除
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {addresses.map((address, index) => (
                  <button
                    key={address.id}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      selectedAddressId === address.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    onClick={() => setSelectedAddressId(address.id)}
                  >
                    {address.label}
                    {index === 0 ? '（默认）' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-3 text-sm font-medium text-slate-700">选择支付方式</div>
              <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="grid gap-3 sm:grid-cols-3">
                <Radio.Button value="alipay" className="rounded-2xl text-center">支付宝</Radio.Button>
                <Radio.Button value="wechat" className="rounded-2xl text-center">微信支付</Radio.Button>
                <Radio.Button value="card" className="rounded-2xl text-center">银行卡</Radio.Button>
              </Radio.Group>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
              <SafetyCertificateOutlined className="mr-2" />
              页面仅为健康营养产品模拟支付，不生成真实药品订单。
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-3xl border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="mb-4 text-lg font-semibold text-slate-900">结算信息</div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>订单金额</span>
                  <span>¥{total}</span>
                </div>
                <div className="flex justify-between">
                  <span>优惠抵扣</span>
                  <span className="font-semibold text-red-500">¥0</span>
                </div>
                <Divider className="my-4" />
                <div className="flex justify-between text-base font-semibold text-slate-900">
                  <span>应付金额</span>
                  <span>¥{total}</span>
                </div>
              </div>
              <Button type="primary" block size="large" className="mt-5 h-12 rounded-2xl bg-slate-900 hover:bg-blue-700" onClick={handlePay}>
                立即支付
              </Button>
            </Card>

            <Card className="rounded-3xl border-blue-100 bg-blue-50 shadow-none">
              <div className="flex items-start gap-3 text-blue-900">
                <CheckCircleOutlined className="mt-1 text-xl" />
                <div className="text-sm leading-7">
                  支付完成后将进入订单确认页。当前页面为演示环境，所有支付流程均为模拟，不会产生真实扣款。
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Modal
        title={editingAddressId ? '修改收货地址' : '新增收货地址'}
        open={addressModalOpen}
        okText={editingAddressId ? '保存修改' : '添加地址'}
        cancelText="取消"
        onOk={saveAddress}
        onCancel={closeAddressModal}
        centered
      >
        <Form layout="vertical" requiredMark={false} className="pt-2">
          <Form.Item label="地址名称" required>
            <Input value={addressLabel} onChange={(e) => setAddressLabel(e.target.value)} placeholder="例如：默认地址 / 家用地址" />
          </Form.Item>
          <Form.Item label="详细地址" required>
            <Input.TextArea value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} placeholder="请输入详细收货地址" rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Footer />
    </div>
  )
}

export default Pay
