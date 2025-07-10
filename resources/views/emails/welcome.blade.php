@component('mail::message')
# Seja Bem-vindo(a), {{ $name }}!

Obrigado por se registrar em nossa plataforma. Estamos muito felizes em tê-lo(a) conosco.

@component('mail::button', ['url' => $url])
Acessar seu Painel
@endcomponent

@component('mail::panel')
Lembre-se de completar seu perfil para ter a melhor experiência possível.
@endcomponent

Atenciosamente,<br>
{{ config('app.name') }}
@endcomponent