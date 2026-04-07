<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = [
            ['agency' => 'Agence Dakar Auto', 'listing_type' => 'rental', 'name' => 'Toyota Land Cruiser', 'brand' => 'Toyota', 'model' => 'Land Cruiser', 'year' => 2022, 'category' => 'SUV', 'class_name' => 'Standard', 'price' => 75000, 'price_unit' => 'day', 'city' => 'Dakar', 'status' => 'available', 'summary' => 'SUV premium pour trajets confortables', 'description' => 'Toyota Land Cruiser 2022 pour location premium.', 'seats' => 7, 'doors' => 5, 'transmission' => 'Automatique', 'fuel_type' => 'Essence', 'mileage' => 30000, 'engine' => '4000 cm3', 'consumption' => '11.5 L/100km', 'horsepower' => '305 ch', 'rating' => 4.2, 'reviews_count' => 18, 'location_label' => 'Dakar Plateau', 'gallery' => ['landcruiser.jpg'], 'equipment' => ['Climatisation', 'GPS', 'Bluetooth'], 'tags' => ['SUV', '7 places', 'Auto']],
            ['agency' => 'TransAfrica Location', 'listing_type' => 'rental', 'name' => 'Mercedes Sprinter', 'brand' => 'Mercedes', 'model' => 'Sprinter', 'year' => 2020, 'category' => 'Van', 'class_name' => 'Standard', 'price' => 120000, 'price_unit' => 'day', 'city' => 'Dakar', 'status' => 'available', 'summary' => 'Van idéal pour les groupes', 'description' => 'Mercedes Sprinter pour transport de groupe.', 'seats' => 9, 'doors' => 5, 'transmission' => 'Manuelle', 'fuel_type' => 'Diesel', 'mileage' => 65000, 'engine' => '2143 cm3', 'consumption' => '9.2 L/100km', 'horsepower' => '163 ch', 'rating' => 4.8, 'reviews_count' => 32, 'location_label' => 'Almadies', 'gallery' => ['mercedes sprinter.jpg'], 'equipment' => ['Climatisation', 'GPS'], 'tags' => ['Van', '9 places']],
            ['agency' => 'Premium Cars Dakar', 'listing_type' => 'rental', 'name' => 'Hyundai Tucson', 'brand' => 'Hyundai', 'model' => 'Tucson', 'year' => 2023, 'category' => 'SUV', 'class_name' => 'Standard', 'price' => 65000, 'price_unit' => 'day', 'city' => 'Dakar', 'status' => 'available', 'summary' => 'SUV moderne et urbain', 'description' => 'Hyundai Tucson 2023, très bon rapport qualité-prix.', 'seats' => 5, 'doors' => 5, 'transmission' => 'Automatique', 'fuel_type' => 'Essence', 'mileage' => 22000, 'engine' => '1600 cm3', 'consumption' => '8.1 L/100km', 'horsepower' => '180 ch', 'rating' => 4.0, 'reviews_count' => 11, 'location_label' => 'Mermoz', 'gallery' => ['tucson.png'], 'equipment' => ['Camera 360', 'CarPlay'], 'tags' => ['SUV', '5 places']],
            ['agency' => 'Dakar Auto Services', 'listing_type' => 'rental', 'name' => 'Renault Duster', 'brand' => 'Renault', 'model' => 'Duster', 'year' => 2022, 'category' => 'SUV', 'class_name' => 'Eco', 'price' => 55000, 'price_unit' => 'day', 'city' => 'Dakar', 'status' => 'available', 'summary' => 'SUV robuste et économique', 'description' => 'Renault Duster 2022.', 'seats' => 5, 'doors' => 5, 'transmission' => 'Manuelle', 'fuel_type' => 'Diesel', 'mileage' => 43000, 'engine' => '1500 cm3', 'consumption' => '6.5 L/100km', 'horsepower' => '115 ch', 'rating' => 3.5, 'reviews_count' => 7, 'location_label' => 'Medina', 'gallery' => ['duster.jpeg'], 'equipment' => ['Bluetooth', 'ABS'], 'tags' => ['SUV', 'Eco']],
            ['agency' => 'TransAfrica Location', 'listing_type' => 'rental', 'name' => 'Toyota Hiace', 'brand' => 'Toyota', 'model' => 'Hiace', 'year' => 2019, 'category' => 'Minibus', 'class_name' => 'Standard', 'price' => 180000, 'price_unit' => 'day', 'city' => 'Dakar', 'status' => 'maintenance', 'summary' => 'Minibus pour transport de passagers', 'description' => 'Toyota Hiace 14 places.', 'seats' => 14, 'doors' => 4, 'transmission' => 'Manuelle', 'fuel_type' => 'Diesel', 'mileage' => 98000, 'engine' => '2494 cm3', 'consumption' => '10.5 L/100km', 'horsepower' => '148 ch', 'rating' => 4.1, 'reviews_count' => 24, 'location_label' => 'Dakar', 'gallery' => ['toyota hiace.jpg'], 'equipment' => ['Climatisation'], 'tags' => ['Minibus']],
            ['agency' => 'Auto Plus SN', 'listing_type' => 'sale', 'name' => 'Renault Clio', 'brand' => 'Renault', 'model' => 'Clio', 'year' => 2021, 'category' => 'Berline', 'class_name' => 'Eco', 'price' => 4500000, 'price_unit' => 'fixed', 'service_fee' => 95000, 'city' => 'Dakar', 'status' => 'for_sale', 'summary' => 'Citadine bien entretenue', 'description' => 'Renault Clio 2021 en très bon état.', 'seats' => 5, 'doors' => 5, 'transmission' => 'Manuelle', 'fuel_type' => 'Essence', 'mileage' => 52000, 'engine' => '1200 cm3', 'consumption' => '5.5 L/100km', 'horsepower' => '90 ch', 'rating' => 4.3, 'reviews_count' => 9, 'location_label' => 'Dakar', 'gallery' => ['clio.png'], 'equipment' => ['Bluetooth'], 'tags' => ['Berline', 'Occasion']],
            ['agency' => 'Elite Motors SN', 'listing_type' => 'sale', 'name' => 'BMW Serie 3', 'brand' => 'BMW', 'model' => 'Serie 3', 'year' => 2020, 'category' => 'Berline Luxe', 'class_name' => 'Luxe', 'price' => 12000000, 'price_unit' => 'fixed', 'service_fee' => 125000, 'city' => 'Dakar', 'status' => 'for_sale', 'summary' => 'Berline premium full options', 'description' => 'BMW Serie 3 full options.', 'seats' => 5, 'doors' => 4, 'transmission' => 'Automatique', 'fuel_type' => 'Essence', 'mileage' => 38000, 'engine' => '2000 cm3', 'consumption' => '7.2 L/100km', 'horsepower' => '255 ch', 'rating' => 4.9, 'reviews_count' => 21, 'location_label' => 'Plateau', 'gallery' => ['bmw-x5-30d-2019-08_1.jpg'], 'equipment' => ['Camera 360', 'Cuir'], 'tags' => ['Luxe', 'Premium']],
            ['agency' => 'Dakar Auto Services', 'listing_type' => 'sale', 'name' => 'Kia Sportage', 'brand' => 'Kia', 'model' => 'Sportage', 'year' => 2019, 'category' => 'SUV', 'class_name' => 'Standard', 'price' => 7200000, 'price_unit' => 'fixed', 'service_fee' => 95000, 'city' => 'Dakar', 'status' => 'for_sale', 'summary' => 'SUV fiable pour usage quotidien', 'description' => 'Kia Sportage 2019.', 'seats' => 5, 'doors' => 5, 'transmission' => 'Automatique', 'fuel_type' => 'Diesel', 'mileage' => 74000, 'engine' => '1700 cm3', 'consumption' => '6.8 L/100km', 'horsepower' => '141 ch', 'rating' => 3.8, 'reviews_count' => 14, 'location_label' => 'Dakar', 'gallery' => ['kia.png'], 'equipment' => ['Camera recul'], 'tags' => ['SUV', 'Diesel']],
            ['agency' => 'AutoSud SN', 'listing_type' => 'sale', 'name' => 'Toyota Hilux', 'brand' => 'Toyota', 'model' => 'Hilux', 'year' => 2018, 'category' => 'Pick-up', 'class_name' => 'Standard', 'price' => 9800000, 'price_unit' => 'fixed', 'service_fee' => 95000, 'city' => 'Thies', 'status' => 'for_sale', 'summary' => 'Pick-up robuste', 'description' => 'Toyota Hilux pour activités intensives.', 'seats' => 5, 'doors' => 4, 'transmission' => 'Manuelle', 'fuel_type' => 'Diesel', 'mileage' => 90000, 'engine' => '2400 cm3', 'consumption' => '9.8 L/100km', 'horsepower' => '150 ch', 'rating' => 3.2, 'reviews_count' => 6, 'location_label' => 'Thies Centre', 'gallery' => ['toyotahilux.png'], 'equipment' => ['4x4'], 'tags' => ['Pick-up']],
            ['agency' => 'MobileCar', 'listing_type' => 'sale', 'name' => 'Peugeot 3008', 'brand' => 'Peugeot', 'model' => '3008', 'year' => 2022, 'category' => 'SUV', 'class_name' => 'Luxe', 'price' => 17000000, 'price_unit' => 'fixed', 'service_fee' => 150000, 'city' => 'Dakar', 'status' => 'for_sale', 'summary' => 'SUV quasi neuf', 'description' => 'Peugeot 3008 GT 2022.', 'seats' => 5, 'doors' => 5, 'transmission' => 'Automatique', 'fuel_type' => 'Essence', 'mileage' => 18000, 'engine' => '1600 cm3', 'consumption' => '6.9 L/100km', 'horsepower' => '225 ch', 'rating' => 4.7, 'reviews_count' => 30, 'location_label' => 'Grand-Yoff', 'gallery' => ['3008.png'], 'equipment' => ['Toit panoramique'], 'tags' => ['SUV', 'Luxe']],
        ];

        foreach ($vehicles as $index => $data) {
            $agency = Agency::query()->where('name', $data['agency'])->firstOrFail();

            Vehicle::query()->updateOrCreate(
                ['reference' => 'VHC-'.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT)],
                [
                    ...collect($data)->except('agency')->all(),
                    'agency_id' => $agency->id,
                    'reference' => 'VHC-'.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT),
                    'slug' => Str::slug($data['brand'].'-'.$data['model'].'-'.$data['year'].'-'.$index),
                    'is_featured' => $index < 5,
                    'specifications' => [
                        ['label' => 'Sièges', 'value' => $data['seats'].' places'],
                        ['label' => 'Catégorie', 'value' => $data['category']],
                        ['label' => 'Transmission', 'value' => $data['transmission']],
                    ],
                ]
            );
        }
    }
}
