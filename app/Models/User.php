<?php
declare(strict_types=1);

namespace CodeShopping\Models;

use Illuminate\Support\Facades\Event;
use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Mnabialek\LaravelEloquentFilter\Traits\Filterable;
use CodeShopping\Models\UserProfile;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable, SoftDeletes, Filterable;

    const ROLE_SELLER = 1;      // Vendedor
    const ROLE_CUSTOMER = 2;    // Cliente

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name', 'email', 'password'
    ];

    protected $hidden = [
        'password', 'remember_token'
    ];

    public static function createCustomer (array $data): User
    {   
        try {
            UserProfile::uploadPhoto($data['photo']);
            \DB::beginTransaction();
            $user = self::createCustomerUser($data);
            UserProfile::saveProfile($user, $data);
            \DB::commit();
        } catch (\Exception $e) {
            UserProfile::deleteFile($data['photo']);
            \DB::rollBack();
            throw $e;
        }
        return $user;
    }

    private static function createCustomerUser($data): User
    {
        $data['password'] = bcrypt(str_random(16));
        $user = User::create($data);
        $user->role = User::ROLE_CUSTOMER;
        $user->save();
        return $user;
    } 

    public function updateWithProfile(array $data): User
    {
        try {
            if (isset($data['photo'])){
                UserProfile::uploadPhoto($data['photo']);
            }
            \DB::beginTransaction();
            $this->fill($data);
            $this->save();
            UserProfile::saveProfile($this, $data);
            \DB::commit();
        } catch (\Exception $e) {
            if (isset($data['photo'])){
                UserProfile::deleteFile($data['photo']);
            }
            \DB::rollBack();
            throw $e;
        }
        return $this;
    }

    public function fill(array $attributes)
    {
        !isset($attributes['password'])?:$attributes['password'] = bcrypt($attributes['password']); //se não tiver password, não faz nada. Se tiver, faz atribuição
        return parent::fill($attributes);
    }

    public function getJWTIdentifier()
    {
        return $this->id;
    }

    public function getJWTCustomClaims()
    {
        return [
            'email' => $this->email,
            'name' => $this->name,
            'profile' => [
                //'has_photo' => $this->profile->photo?true:false,
                'photo_url' => $this->profile->photo_url,
                'phone_number' => $this->profile->phone_number
            ]
        ];
    }

    public function profile()
    {
        return $this->hasOne(UserProfile::class)->withDefault();
    }
}
