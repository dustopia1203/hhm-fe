import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import Footer from "@components/features/Footer.tsx"
import { useGetAccountProfileApi } from "@apis/useAccountApis.ts"
import { toast } from "sonner"
import { RxAvatar } from "react-icons/rx"
import Loader from "@components/common/Loader.tsx"
import auth from "@utils/auth.ts"
import { format } from 'date-fns'
import Header from '@/components/features/Header'
import ChangePasswordForm from '@/components/features/ChangePasswordForm'

export const Route = createFileRoute('/my/profile')({
  beforeLoad: () => auth([]),
  component: RouteComponent,
})

function RouteComponent() {
  const { data: profileData, isLoading } = useGetAccountProfileApi()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [profile, setProfile] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: ''
  })

  useEffect(() => {
    if (profileData?.data) {
      setProfile({
        firstName: profileData.data.firstName || '',
        middleName: profileData.data.middleName || '',
        lastName: profileData.data.lastName || '',
        phone: profileData.data.phone || '',
        dateOfBirth: profileData.data.dateOfBirth ? format(new Date(profileData.data.dateOfBirth), 'yyyy-MM-dd') : '',
        gender: profileData.data.gender || '',
        address: profileData.data.address || ''
      })
    }
  }, [profileData])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }


  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement update profile API
    toast.success('Cập nhật thông tin thành công')
    setIsEditing(false)
  }

  if (isLoading) {
    return <Loader />
  }

  const currentProfile = profileData?.data

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-900">
      <Header />

      <main className="flex-grow py-8 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Profile Information */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                  {currentProfile?.avatarUrl ? (
                    <img
                      src={currentProfile.avatarUrl}
                      alt="Profile avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <RxAvatar size={50} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {currentProfile?.firstName} {currentProfile?.middleName} {currentProfile?.lastName}
                  </h1>
                  <p className="text-gray-400">{currentProfile?.username}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Họ</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Tên đệm</label>
                    <input
                      type="text"
                      name="middleName"
                      value={profile.middleName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Tên</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Giới tính</label>
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Ngày sinh</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profile.dateOfBirth}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 mb-2">Địa chỉ</label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-gray-400 mb-2">Thông tin cá nhân</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Giới tính:</span>
                      <span className="text-white ml-2">
                        {currentProfile?.gender === 'MALE' ? 'Nam' : currentProfile?.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Ngày sinh:</span>
                      <span className="text-white ml-2">
                        {currentProfile?.dateOfBirth ? format(new Date(currentProfile.dateOfBirth), 'dd/MM/yyyy') : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Số điện thoại:</span>
                      <span className="text-white ml-2">{currentProfile?.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Địa chỉ:</span>
                      <span className="text-white ml-2">{currentProfile?.address || 'N/A'}</span>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => setIsChangingPassword(!isChangingPassword)}
                        className="text-blue-500 hover:text-blue-400 text-sm"
                      >
                        Đổi mật khẩu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {isChangingPassword && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <ChangePasswordForm
                username={currentProfile?.username || ''}
                onClose={() => setIsChangingPassword(false)}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}