<?php
namespace Adminer;

class Prefill extends Plugin {
    function loginFormField($name, $heading, $value) {
        $defaults = [
            'driver'   => 'pgsql',
            'server'   => getenv('PGHOST') ?: 'db',
            'username' => getenv('PGUSER'),
            'password' => getenv('PGPASSWORD'),
            'db'       => getenv('PGDATABASE'),
        ];

        if (isset($defaults[$name])) {
            $v = htmlspecialchars($defaults[$name], ENT_QUOTES);

            if ($name === 'driver') {
                $value = preg_replace('/(<option value="pgsql")/', '$1 selected', $value);
            } elseif (strpos($value, 'value="') !== false) {
                $value = preg_replace('/value="[^"]*"/', 'value="' . $v . '"', $value, 1);
            } else {
                $value = preg_replace('/<input/', '<input value="' . $v . '"', $value, 1);
            }
        }

        if ($name === 'db') {
            $nonce = function_exists(__NAMESPACE__ . '\nonce') ? nonce() : '';
            $value .= "<script$nonce>
                document.addEventListener('DOMContentLoaded', function () {
                    if (document.querySelector('.error, .message')) return;
                    var button = document.querySelector('form input[type=submit]');
                    if (button) button.click();
                });
            </script>";
        }

        return $heading . $value . "\n";
    }
}

return new Prefill;