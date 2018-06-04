<?php
declare(strict_types=1);

namespace CodeShopping\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use Sluggable;
    protected $fillable = ['name', 'description', 'price', 'active'];

    public function sluggable()
    {
        return [
            'slug' => [
                'source' => 'name'
            ]
        ];  
    }
   
    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    // one to many -> um produto pode ter uma ou várias fotos
    public function photos()
    {
        return $this->hasMany(ProductPhoto::class); // hasMany contrário do belongTo
    }
}

