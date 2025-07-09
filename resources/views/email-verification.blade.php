<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo(a) à Reactify</title>
  <style>
    /* Estilos gerais para o corpo do email */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
      margin: 0;
      padding: 0;
      width: 100%;
      background-color: #f4f7f6;
    }
    /* Estilos para o container principal */
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    /* Estilos para o card do conteúdo */
    .content {
      background-color: #ffffff;
      padding: 40px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    /* Estilos para o título */
    h1 {
      color: #2d3748;
      font-size: 24px;
    }
    /* Estilos para o parágrafo */
    p {
      color: #4a5568;
      font-size: 16px;
      line-height: 1.5;
    }
    /* Estilos para o botão de call-to-action */
    .button {
      display: inline-block;
      padding: 12px 24px;
      margin: 20px 0;
      background-color: #4299e1; /* Um azul amigável */
      color: #ffffff;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      border-radius: 5px;
    }
    /* Estilos para o rodapé */
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #a0aec0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      {{-- O logo da sua aplicação pode vir aqui --}}
      {{-- <img src="https://sua-aplicacao.com/logo.png" alt="Logo Reactify" style="max-width: 150px; margin-bottom: 20px;"> --}}

      <h1>Bem-vindo(a) à Reactify!</h1>

      <p>Olá, <strong>Caro(a) Usuário(a)</strong>,</p>

      <p>Sua conta foi criada com sucesso em nossa plataforma. Estamos muito felizes em ter você conosco.</p>

      <p>Clique no botão abaixo para acessar sua conta e começar a usar a aplicação.</p>

      <a href="https://sua-aplicacao.com/login" class="button">Acessar a Aplicação</a>

      <p style="font-size: 14px; color: #718096;">Se o botão não funcionar, copie e cole o seguinte link no seu navegador:</p>
      <p style="font-size: 12px; word-break: break-all;"><a href="https://sua-aplicacao.com/login" style="color: #4299e1;">https://sua-aplicacao.com/login</a></p>
    </div>

    <div class="footer">
      <p>&copy; 2025 Reactify. Todos os direitos reservados.</p>
      <p>Você está recebendo este e-mail porque se cadastrou em nossa plataforma.</p>
    </div>
  </div>
</body>
</html>