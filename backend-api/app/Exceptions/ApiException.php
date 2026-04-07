<?php

namespace App\Exceptions;

use Exception;

class ApiException extends Exception
{
    /**
     * @param array<string, array<int, string>|string> $errors
     */
    public function __construct(
        string $message = 'Une erreur API est survenue.',
        private readonly int $statusCode = 400,
        private readonly array $errors = [],
    ) {
        parent::__construct($message, $statusCode);
    }

    public function statusCode(): int
    {
        return $this->statusCode;
    }

    /**
     * @return array<string, array<int, string>|string>
     */
    public function errors(): array
    {
        return $this->errors;
    }
}
