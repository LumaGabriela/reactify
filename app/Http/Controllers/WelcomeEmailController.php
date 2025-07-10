<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmail;

class WelcomeEmailController extends Controller
{
  public function store(Request $request)
  {
    $validated = $request->validate([
      'email' => 'required|email',
      'name' => 'required|string'
    ]);

    Mail::to($validated['email'])->send(new WelcomeEmail( $validated['name']));

    return;
  }
}
