<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    protected $manager;

    public function __construct()
    {
        // Use GD driver as it is most commonly available
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Process and compress an uploaded image.
     * 
     * @param UploadedFile $file
     * @param string $directory
     * @param int $maxWidth
     * @param int $quality
     * @return string The stored file path
     */
    public function compressAndStore(UploadedFile $file, string $directory = 'audit-photos', int $maxWidth = 1200, int $quality = 75): string
    {
        // Generate unique filename
        $filename = Str::random(40) . '.jpg'; // Store as JPG for consistent compression
        $path = $directory . '/' . $filename;

        // Read image
        $image = $this->manager->read($file);

        // Resize if larger than maxWidth (maintaining aspect ratio)
        $image->scale(width: $maxWidth);

        // Encode as Jpeg with quality
        $encoded = $image->toJpeg($quality);
        
        Storage::disk('public')->put($path, (string) $encoded);

        return $path;
    }
}
