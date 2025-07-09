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

  public function store()
  {
    $message = Mail::to('lumagabriela1333@gmail.com', 'Raccoon')->send(new UserEmailVerification([
      'name' => 'Luma Andrade',
      'email' => 'lumagabriela1333@gmail.com',
      'subject' => 'Verificação de Email',
      'message' => 'Por favor, verifique seu email clicando no link abaixo.',
    ]));

    dump($message);
    return;
  }
}
