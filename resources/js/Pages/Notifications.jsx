import MainLayout from '@/Layouts/MainLayout'
import { usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BellRing, Trash } from 'lucide-react'

const Notifications = () => {
  const { auth } = usePage().props
  const { notifications } = auth

  return (
    <div className="container mx-auto py-10">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 text-2xl font-bold">
            <div className="flex items-center gap-2">
              <BellRing className="h-6 w-6" />
              <span>Notifications</span>
            </div>
            <Button variant="secondary" className="h-12 ">
              Mark all as read
              <Trash className="!size-6" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="cursor-pointer flex flex-col gap-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-lg bg-foreground/10 p-4"
                >
                  <p className="font-medium text-foreground">
                    {notification.data?.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">
                You have no notifications.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

Notifications.layout = (page) => <MainLayout children={page} />
export default Notifications
