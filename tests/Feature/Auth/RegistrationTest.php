<?php

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('registration screen can be rendered', function () {
  $response = $this->get('/register');

  $response->assertStatus(200);
});

test('new users can register', function () {

  $response = $this->post('/register', [
    'name' => 'lumis',
    'email' => 'lumaa@gmail.com',
    'password' => 'password@123',
    'password_confirmation' => 'password@123',
  ]);

  $response->assertSessionHasNoErrors();

  $this->assertAuthenticated();

  $response->assertRedirect(route('dashboard', absolute: false));
});
