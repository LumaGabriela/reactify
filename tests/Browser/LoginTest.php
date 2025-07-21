<?php

uses(\Tests\DuskTestCase::class);
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Sleep;
use Laravel\Dusk\Browser;

test('example', function () {
    $this->browse(function (Browser $browser) {
        $browser
        ->visit('/login')
        ->type('email', 'admin@example.com')
        ->type('password', 'senha123')
        ->press('@login-button');
        Sleep(1);
    });
});
