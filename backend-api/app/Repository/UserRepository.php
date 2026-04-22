<?php

namespace App\Repository;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class UserRepository
{
    public function create(array $data): User
    {
        return User::query()->create($data);
    }

    public function findByRoleAndIdentifier(string $role, string $identifier): ?User
    {
        $normalizedIdentifier = trim($identifier);

        return User::query()
            ->where('role', $role)
            ->where(function (Builder $query) use ($normalizedIdentifier): void {
                $query->whereRaw('LOWER(email) = ?', [mb_strtolower($normalizedIdentifier)])
                    ->orWhere('phone', $normalizedIdentifier);
            })
            ->first();
    }

    public function findByEmail(string $email): ?User
    {
        return User::query()->where('email', $email)->first();
    }

    public function findByPhone(string $phone): ?User
    {
        return User::query()->where('phone', $phone)->first();
    }

    public function getAllWithAgency()
    {
        return User::query()->with('agency')->latest()->get();
    }
}
