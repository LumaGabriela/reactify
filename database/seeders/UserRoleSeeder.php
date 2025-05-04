<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('user_roles')->insert([
            [
                'name' => 'admin',
                'can_create' => true,
                'can_read' => true,
                'can_update' => true
            ],
            [
                'name' => 'user', // Role padrão
                'can_create' => false,
                'can_read' => true,
                'can_update' => false,
            ]
        ]);
    }
}
