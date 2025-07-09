<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserEmailVerification;

class UserEmailVerificationController extends Controller
{

  public function index()
  {
    return view('email-verification');
  }

  public function store(Request $request)
  {
    $message = Mail::to('lumagabriela3331@gmail.com', 'Usuário')->send(new UserEmailVerification([
      'name' => 'Admin',
      'email' => 'lumaandrade@zohomail.com',
      'subject' => 'Verificação de Email',
      'message' => 'Por favor, verifique seu email clicando no link abaixo.',
    ]));

    return;
  }
}
