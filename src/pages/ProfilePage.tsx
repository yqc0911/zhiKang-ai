import { useState } from 'react'
import { Avatar, Button, Card, Form, Input, Modal, Progress, Tag } from 'antd'
import { EditOutlined, HeartOutlined, SettingOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons'
import HomePage from '../component/HomePage'

const ProfilePage = () => {
    const [editOpen, setEditOpen] = useState(false)
    const [form] = Form.useForm()

    const stats = [
        { label: '已保存问诊', value: '12 次' },
        { label: '本月活跃', value: '8 天' },
        { label: '健康评分', value: '86 分' },
    ]

    const timeline = [
        '完成最近一次 AI 问诊，系统建议持续观察血压波动',
        '更新了过敏史与用药记录，方便后续精准问诊',
        '收藏了 3 篇健康科普文章，持续进行健康管理',
    ]

    const handleOpenEdit = () => {
        form.setFieldsValue({
            name: '张医生',
            age: '28',
            device: '手机、手环',
        })
        setEditOpen(true)
    }

    const handleSubmit = () => {
        form.validateFields().then(() => setEditOpen(false))
    }

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-cyan-50">
            <HomePage />

            <main className="mx-auto flex h-[calc(100vh-72px)] w-full max-w-7xl items-center px-4 py-4 md:px-8 md:py-6">
                <div className="grid w-full gap-4 overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
                    <Card className="overflow-hidden rounded-[2rem] border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar size={80} className="bg-blue-600 text-3xl" icon={<UserOutlined />} />
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-2xl font-bold text-slate-800">个人档案</h1>
                                        <Tag color="blue" className="rounded-full px-3 py-1 text-sm">
                                            健康档案已开启
                                        </Tag>
                                    </div>
                                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                                        在这里管理你的基础信息、健康目标和历史记录，让 AI 问诊更懂你。
                                    </p>
                                </div>
                            </div>

                            <Button type="primary" icon={<EditOutlined />} className="h-10 rounded-xl px-5" onClick={handleOpenEdit}>
                                编辑资料
                            </Button>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            {stats.map((item) => (
                                <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                                    <div className="text-sm text-slate-500">{item.label}</div>
                                    <div className="mt-2 text-xl font-semibold text-slate-800">{item.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_0.9fr]">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <div className="flex items-center gap-2 text-base font-semibold text-slate-800">
                                    <HeartOutlined className="text-pink-500" />
                                    健康概况
                                </div>
                                <div className="mt-4 space-y-3">
                                    <div>
                                        <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                                            <span>整体健康指数</span>
                                            <span>86%</span>
                                        </div>
                                        <Progress percent={86} strokeColor="#2563eb" showInfo={false} />
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                                        建议保持规律作息与适度运动，并持续记录近期症状变化，以便获得更准确的个性化建议。
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <div className="flex items-center gap-2 text-base font-semibold text-slate-800">
                                    <TrophyOutlined className="text-amber-500" />
                                    健康目标
                                </div>
                                <div className="mt-4 space-y-3 text-slate-600">
                                    <div className="rounded-2xl bg-amber-50 p-3">本周完成 5 次步行锻炼</div>
                                    <div className="rounded-2xl bg-emerald-50 p-3">每日饮水量达到 1500ml</div>
                                    <div className="rounded-2xl bg-blue-50 p-3">每周记录一次健康指标</div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[2rem] border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                        <div className="flex items-center gap-2 text-base font-semibold text-slate-800">
                            <SettingOutlined className="text-blue-600" />
                            个人设置与动态
                        </div>

                        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                            <div className="text-sm text-slate-500">基础资料</div>
                            <div className="mt-3 space-y-2 text-slate-700">
                                <div>姓名：张医生</div>
                                <div>年龄：28 岁</div>
                                <div>常用设备：手机、手环</div>
                            </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                            <div className="text-sm font-medium text-slate-800">最近动态</div>
                            <div className="mt-3 space-y-3">
                                {timeline.map((item) => (
                                    <div key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                                        <span className="mt-2 h-2 w-2 flex-none rounded-full bg-blue-500" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </main>

            <Modal
                title="编辑资料"
                open={editOpen}
                onCancel={() => setEditOpen(false)}
                onOk={handleSubmit}
                okText="保存"
                cancelText="取消"
                centered
                destroyOnHidden
            >
                <Form form={form} layout="vertical" className="mt-4">
                    <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
                        <Input placeholder="请输入姓名" />
                    </Form.Item>
                    <Form.Item label="年龄" name="age" rules={[{ required: true, message: '请输入年龄' }]}>
                        <Input placeholder="请输入年龄" />
                    </Form.Item>
                    <Form.Item label="常用设备" name="device" rules={[{ required: true, message: '请输入常用设备' }]}>
                        <Input placeholder="例如：手机、手环" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ProfilePage
