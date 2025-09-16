import MainLayout from '@/Layouts/MainLayout'
import { usePage, router } from '@inertiajs/react'
import { BellRing, Trash } from 'lucide-react'

const Notifications = () => {
  const { auth } = usePage().props
  const { notifications } = auth

  const formatDateTime = (dateString) => {
    // Retorna uma string vazia se a data não existir, para evitar erros
    if (!dateString) return ''

    const date = new Date(dateString)

    const options = {
      day: '2-digit', // dia com dois dígitos (ex: 05, 23)
      month: '2-digit', // mês com dois dígitos (ex: 07)
      year: 'numeric', // ano com quatro dígitos (ex: 2023)
      hour: '2-digit', // hora com dois dígitos
      minute: '2-digit', // minuto com dois dígitos
      hour12: false, // Usar formato 24h, se preferir 12h, coloque true
    }

    // Usamos 'pt-BR' para garantir a formatação correta para o Brasil (dia/mês)
    // O método format() retorna a string final.
    return new Intl.DateTimeFormat('pt-BR', options).format(date)
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 text-2xl font-bold">
            <div className="flex items-center gap-2">
              <BellRing className="h-6 w-6" />
              <span>Notifications</span>
            </div>
            <Button
              variant="secondary"
              className="h-12 "
              onClick={() => router.patch(route('notifications.read'))}
            >
              Mark all as read
              <Trash className="!size-6" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="cursor-pointer flex flex-col gap-4">
              {notifications.map((notification) => {
                const { invitation } = notification

                return (
                  <section
                    key={notification.id}
                    className={`${notification.read_at ? 'opacity-50' : ''} flex justify-between rounded-lg bg-foreground/10 p-4`}
                  >
                    <div className="flex flex-col justify-between">
                      <p className="font-medium text-foreground">
                        {notification.data?.message}
                      </p>
                      <span className="text-xs">
                        {formatDateTime(notification?.created_at)}
                      </span>
                    </div>
                    {/* caso exista um token de convite*/}
                    {invitation && invitation.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          onClick={() => {
                            router.get(
                              route('invitations.accept', {
                                invitation: invitation.token,
                              }),
                            )
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            router.get(
                              route('invitations.decline', {
                                invitation: invitation.token,
                              }),
                            )
                          }}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </section>
                )
              })}
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
