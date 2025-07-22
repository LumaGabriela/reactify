import MainLayout from '@/Layouts/MainLayout'
import { usePage } from '@inertiajs/react'
const Notifications = () => {
  const props = usePage().props
  const notifications = props.auth.notifications
  console.log(notifications)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Notifications</h1>
      <div className="flex w-full">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex flex-col items-center justify-center w-full"
            >
              <p className="text-lg font-bold">{notification.data?.message}</p>
            </div>
          ))
        ) : (
          <p className="text-lg text-gray-600">You have no notifications.</p>
        )}
      </div>
    </div>
  )
}

Notifications.layout = (page) => <MainLayout children={page} />
export default Notifications
