<?php

uses(\Tests\DuskTestCase::class);
use Illuminate\Foundation\Testing\DatabaseMigrations;
use App\Models\User;
use Laravel\Dusk\Browser;

test('example', function () {
    $this->browse(function (Browser $browser) {
        $browser->loginAs(User::find(1))
        ->visitRoute('projecs.show', ['id' => 1])
        ->click('@btn-stories')
        ->click('button');
        Sleep(5);
    });
});
