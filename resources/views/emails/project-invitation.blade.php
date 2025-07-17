@component('mail::message')
Você recebeu um convite de {{ $invitation->inviter->name }} para participar do projeto {{ $invitation->project->title }}.

Você pode aceitar ou recusar o convite clicando nos botões abaixo:

@component('mail::button', ['url' => route('invitations.accept', ['invitation' => $invitation->token])])
Aceitar Convite
@endcomponent

@component('mail::button', ['url' => route('invitations.decline', ['invitation' => $invitation->token])])
Recusar Convite
@endcomponent

@component('mail::panel')
<p>Se você tiver alguma dúvida ou precisar de ajuda, não hesite em nos contatar.</p>
@endcomponent