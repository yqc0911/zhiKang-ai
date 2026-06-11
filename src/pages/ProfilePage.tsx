import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Avatar, Button, Card, DatePicker, Form, Input, Modal, Progress, Select, Spin, Tag, Upload, message } from 'antd'
import { EditOutlined, HeartOutlined, MessageOutlined, PlusOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons'
import HomePage from '../component/HomePage'
import { getChatHistory, getConsultationSummaries, getLoginStats, getToken, getUserProfile, updateUserProfile, type ConsultationSummary, type UserProfile } from '../utils/request'

const emptyProfile: UserProfile = {
    name: '',
    gender: '',
    birthday: '',
    height: '',
    weight: '',
    avatarUrl: '',
}

const ProfilePage = () => {
    const [editOpen, setEditOpen] = useState(false)
    const [avatarOpen, setAvatarOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [form] = Form.useForm()
    const [profile, setProfile] = useState<UserProfile>(emptyProfile)
    const [chatCount, setChatCount] = useState(0)
    const [loginCount, setLoginCount] = useState(0)
    const [consultationSummaries, setConsultationSummaries] = useState<ConsultationSummary[]>([])

    const stats = [
        { label: '已保存问诊', value: `${chatCount} 次` },
        { label: '本月活跃', value: `${loginCount} 天` },
        { label: '健康评分', value: '86 分' },
    ]

    useEffect(() => {
        const loadData = async (showLoading = true) => {
            const token = getToken()
            if (!token) {
                setLoading(false)
                return
            }

            if (showLoading) setLoading(true)
            try {
                const [profileRes, historyRes, loginStatsRes, consultationsRes] = await Promise.allSettled([
                    getUserProfile(),
                    getChatHistory(),
                    getLoginStats(),
                    getConsultationSummaries(),
                ])

                if (profileRes.status === 'fulfilled' && profileRes.value.data?.data) {
                    setProfile({ ...emptyProfile, ...profileRes.value.data.data })
                }

                if (historyRes.status === 'fulfilled') {
                    const threads = historyRes.value.data?.data || []
                    setChatCount(threads.length)
                }

                if (loginStatsRes.status === 'fulfilled') {
                    setLoginCount(loginStatsRes.value.data?.data?.activeDays || 0)
                }

                if (consultationsRes.status === 'fulfilled') {
                    setConsultationSummaries(consultationsRes.value.data?.data || [])
                } else if (profileRes.status === 'fulfilled') {
                    setConsultationSummaries(profileRes.value.data?.data?.consultationSummaries || [])
                }
            } catch (error) {
                console.error('获取个人档案失败:', error)
                message.error('获取个人档案失败，请检查后端服务')
            } finally {
                setLoading(false)
            }
        }

        void loadData()
        const handleConsultationsUpdated = () => {
            void loadData(false)
        }
        window.addEventListener('consultations:updated', handleConsultationsUpdated)
        return () => window.removeEventListener('consultations:updated', handleConsultationsUpdated)
    }, [])

    useEffect(() => {
        if (editOpen) {
            form.setFieldsValue({
                ...profile,
                birthday: profile.birthday ? dayjs(profile.birthday) : undefined,
            })
        }
    }, [editOpen, form, profile])

    const saveProfile = async (nextProfile: UserProfile, successText = '保存成功') => {
        setSaving(true)
        try {
            const res = await updateUserProfile(nextProfile)
            const savedProfile = res.data?.data || nextProfile
            setProfile({ ...emptyProfile, ...savedProfile })
            window.dispatchEvent(new Event('profile:updated'))
            message.success(successText)
            return true
        } catch (error) {
            console.error('保存个人档案失败:', error)
            message.error('保存个人档案失败，请检查后端服务或登录状态')
            return false
        } finally {
            setSaving(false)
        }
    }

    const handleOpenEdit = () => {
        setEditOpen(true)
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            const birthdayValue = values.birthday
            const formattedBirthday = birthdayValue && typeof birthdayValue.format === 'function'
                ? birthdayValue.format('YYYY-MM-DD')
                : birthdayValue

            const success = await saveProfile({
                ...profile,
                name: values.name,
                gender: values.gender,
                birthday: formattedBirthday,
                height: values.height,
                weight: values.weight,
            })

            if (success) {
                setEditOpen(false)
            }
        } catch (error) {
            console.error('表单验证失败:', error)
        }
    }

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-white flex flex-col">
            <div className="flex-none">
                <HomePage />
            </div>

            <Spin spinning={loading} className="flex-1 overflow-hidden">
            <div className="flex-1 overflow-hidden px-4 py-4">
                <div className="mx-auto  h-full max-w-[80vw]  lg:grid-cols-[1.05fr_0.95fr]">
                    <Card className="h-full overflow-hidden rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative cursor-pointer group" onClick={() => setAvatarOpen(true)}>
                                    <Avatar size={80} src={profile.avatarUrl || null} className="bg-blue-600 text-3xl" icon={<UserOutlined />} />
                                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <EditOutlined className="text-white text-xl" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-2xl font-bold text-slate-800">{profile.name} 的个人档案</h1>
                                        <Tag color="blue" className="rounded-full px-3 py-1 text-sm">
                                            健康档案已开启
                                        </Tag>
                                    </div>
                                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                                        在这里管理你的基础信息、健康目标和历史记录，让 AI 问诊更懂你。
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                                        <Tag className="rounded-full px-3 py-1">性别：{profile.gender}</Tag>
                                        <Tag className="rounded-full px-3 py-1">生日：{profile.birthday}</Tag>
                                        <Tag className="rounded-full px-3 py-1">身高：{profile.height}cm</Tag>
                                        <Tag className="rounded-full px-3 py-1">体重：{profile.weight}kg</Tag>
                                    </div>
                                </div>
                            </div>

                            <Button type="primary" icon={<EditOutlined />} className="h-10 rounded-xl px-5" onClick={handleOpenEdit}>
                                编辑资料
                            </Button>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            {stats.map((item) => (
                                <div key={item.label} className="rounded-xl bg-slate-50 p-4">
                                    <div className="text-sm text-slate-500">{item.label}</div>
                                    <div className="mt-2 text-xl font-semibold text-slate-800">{item.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_0.9fr]">
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
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
                                    <div className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                                        建议保持规律作息与适度运动，并持续记录近期症状变化，以便获得更准确的个性化建议。
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="flex items-center gap-2 text-base font-semibold text-slate-800">
                                    <TrophyOutlined className="text-amber-500" />
                                    健康目标
                                </div>
                                <div className="mt-4 space-y-3 text-slate-600">
                                    <div className="rounded-xl bg-amber-50 p-3">本周完成 5 次步行锻炼</div>
                                    <div className="rounded-xl bg-emerald-50 p-3">每日饮水量达到 1500ml</div>
                                    <div className="rounded-xl bg-blue-50 p-3">每周记录一次健康指标</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center gap-2 text-base font-semibold text-slate-800">
                                <MessageOutlined className="text-blue-500" />
                                AI 问诊存档
                            </div>
                            {consultationSummaries.length === 0 ? (
                                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                                    暂无已添加到个人档案的 AI 问诊记录。离开 AI 问诊页时可选择保存本次对话摘要。
                                </div>
                            ) : (
                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    {consultationSummaries.map((item) => (
                                        <div key={item.id} className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <div className="truncate font-semibold text-slate-800">{item.title}</div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        {new Date(item.archivedAt).toLocaleString('zh-CN')} · {item.messageCount} 条消息
                                                    </div>
                                                </div>
                                                <Tag color="blue" className="shrink-0 rounded-full">已存档</Tag>
                                            </div>
                                            <div className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.summary}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
            </Spin>

            <Modal
                title={<span className="text-lg font-semibold text-slate-800">编辑资料</span>}
                open={editOpen}
                onCancel={() => setEditOpen(false)}
                onOk={handleSubmit}
                confirmLoading={saving}
                okText="保存"
                cancelText="取消"
                centered
                destroyOnHidden
                width={760}
                className="profile-edit-modal"
            >
                <Form form={form} layout="vertical" className="mt-4 grid gap-4 md:grid-cols-2">
                    <Form.Item label={<span className="text-slate-600">姓名</span>} name="name" rules={[{ required: true, message: '请输入姓名' }]}>
                        <Input placeholder="请输入姓名" className="rounded-lg" />
                    </Form.Item>
                    <Form.Item label={<span className="text-slate-600">性别</span>} name="gender" rules={[{ required: true, message: '请选择性别' }]}>
                        <Select
                            options={[
                                { value: '男', label: '男' },
                                { value: '女', label: '女' },
                                { value: '其他', label: '其他' },
                            ]}
                            placeholder="请选择性别"
                            className="rounded-lg"
                        />
                    </Form.Item>
                    <Form.Item label={<span className="text-slate-600">出生日期</span>} name="birthday" rules={[{ required: true, message: '请选择出生日期' }]}>
                        <DatePicker className="w-full rounded-lg" placeholder="请选择日期" format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item label={<span className="text-slate-600">身高（cm）</span>} name="height" rules={[{ required: true, message: '请输入身高' }]}>
                        <Input placeholder="例如：172" className="rounded-lg" />
                    </Form.Item>
                    <Form.Item label={<span className="text-slate-600">体重（kg）</span>} name="weight" rules={[{ required: true, message: '请输入体重' }]}>
                        <Input placeholder="例如：68" className="rounded-lg" />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={<span className="text-lg font-semibold text-slate-800">修改头像</span>}
                open={avatarOpen}
                onCancel={() => setAvatarOpen(false)}
                footer={null}
                centered
                width={400}
            >
                <div className="flex flex-col items-center gap-6 py-4">
                    <Avatar size={120} src={profile.avatarUrl} className="bg-blue-600 text-4xl" icon={<UserOutlined />} />
                    <Upload
                        showUploadList={false}
                        beforeUpload={(file) => {
                            const reader = new FileReader()
                            reader.onload = function(e) {
                                const result = e.target?.result
                                if (result && typeof result === 'string') {
                                    void saveProfile({ ...profile, avatarUrl: result }, '头像上传成功')
                                }
                            }
                            reader.readAsDataURL(file)
                            return false
                        }}
                    >
                        <Button icon={<PlusOutlined />}>选择图片</Button>
                    </Upload>
                    {profile.avatarUrl && (
                        <Button type="primary" loading={saving} onClick={() => setAvatarOpen(false)}>
                            完成
                        </Button>
                    )}
                    <div className="text-sm text-slate-500">支持 JPG、PNG 格式，建议尺寸 200x200</div>
                </div>
            </Modal>
        </div>
    )
}

export default ProfilePage
