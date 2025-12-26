<?php

return [

 'paths' => ['*'],


    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'https://*.vercel.app',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Authorization'],

    'max_age' => 0,

    'supports_credentials' => false,
];

