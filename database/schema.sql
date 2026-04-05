USE nutrizi_db;

-- 0. Table: kitchens
CREATE TABLE IF NOT EXISTS kitchens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kitchen_name VARCHAR(100) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 1. Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role ENUM('ADMIN', 'NUTRITIONIST', 'CHEF') NOT NULL DEFAULT 'NUTRITIONIST',
    kitchen_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kitchen_id) REFERENCES kitchens(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 2. Table: schools
CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_name VARCHAR(100) NOT NULL,
    target_group ENUM('PAUD', 'SD', 'SMP', 'SMA') NOT NULL,
    total_beneficiaries INT DEFAULT 0,
    total_teachers INT DEFAULT 0,
    location TEXT,
    location_address TEXT,
    calorie_target_min INT DEFAULT 0,
    calorie_target_max INT DEFAULT 0,
    kitchen_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kitchen_id) REFERENCES kitchens(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. Table: food_items (Master Data TKPI)
CREATE TABLE IF NOT EXISTS food_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('KARBOHIDRAT', 'PROTEIN_HEWANI', 'PROTEIN_NABATI', 'SAYURAN', 'BUAH', 'BUMBU') NOT NULL,
    energy_kcal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    protein_g DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    fat_g DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    carbs_g DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    fiber_g DECIMAL(10,2) DEFAULT 0.00,
    iron_mg DECIMAL(10,2) DEFAULT 0.00,
    zinc_mg DECIMAL(10,2) DEFAULT 0.00,
    vit_a_mcg DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Table: food_conversions (SRT Mapping)
CREATE TABLE IF NOT EXISTS food_conversions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    food_item_id INT NOT NULL,
    unit_name VARCHAR(50) NOT NULL, -- Contoh: 'Centong', 'Butir', 'Potong'
    weight_gram_standard DECIMAL(10,2) NOT NULL,
    weight_gram_min DECIMAL(10,2) NOT NULL,
    weight_gram_max DECIMAL(10,2) NOT NULL,
    yield_factor DECIMAL(5,2) DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Table: student_profiles (Allergy & Health)
CREATE TABLE IF NOT EXISTS student_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    allergy_notes TEXT,
    last_bb DECIMAL(5,2) DEFAULT 0.00,
    last_tb DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Table: refresh_tokens (Access Control)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Table: master_menus (Library of Menu Templates)
CREATE TABLE IF NOT EXISTS master_menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_name VARCHAR(100) NOT NULL,
    target_group ENUM('PAUD', 'SD', 'SMP', 'SMA') NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Table: master_menu_items (Ingredients in Master Menus)
CREATE TABLE IF NOT EXISTS master_menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    master_menu_id INT NOT NULL,
    food_item_id INT NOT NULL,
    portion_name VARCHAR(50) NOT NULL, -- e.g. "Daging Ayam Bakar"
    raw_weight_gram DECIMAL(10,2) NOT NULL,
    unit_name VARCHAR(50), 
    unit_quantity DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (master_menu_id) REFERENCES master_menus(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Table: daily_menus (Logistics & Production Tracker)
CREATE TABLE IF NOT EXISTS daily_menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    menu_date DATE NOT NULL,
    master_menu_id INT, -- Optional link to master menu
    total_beneficiaries INT DEFAULT 0,
    buffer_portions INT DEFAULT 0,
    organoleptic_portions INT DEFAULT 2,
    total_production INT DEFAULT 0, -- Auto-calculated: beneficiaries + buffer + organoleptic
    status ENUM('DRAFT', 'PRODUKSI', 'SIAP_AUDIT', 'DISETUJUI', 'DIPUBLIKASIKAN') DEFAULT 'DRAFT',
    organoleptic_status ENUM('TERTUNDA', 'LULUS', 'GAGAL') DEFAULT 'TERTUNDA',
    warna_skor INT DEFAULT 0,
    aroma_skor INT DEFAULT 0,
    tekstur_skor INT DEFAULT 0,
    rasa_skor INT DEFAULT 0,
    suhu_skor INT DEFAULT 0,
    suhu_pemasakan DECIMAL(5,2) NULL DEFAULT NULL,
    suhu_distribusi DECIMAL(5,2) NULL DEFAULT NULL,
    catatan_qc TEXT,
    foto_menu_url LONGTEXT,
    tanda_tangan_digital LONGTEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (master_menu_id) REFERENCES master_menus(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Table: daily_menu_items (Daily Ingredients Tracker)
CREATE TABLE IF NOT EXISTS daily_menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    daily_menu_id INT NOT NULL,
    food_item_id INT NOT NULL,
    portion_name VARCHAR(50) NOT NULL,
    raw_weight_gram DECIMAL(10,2) NOT NULL,
    unit_name VARCHAR(50), 
    unit_quantity DECIMAL(10,2),
    total_raw_weight_gram DECIMAL(10,2) NOT NULL, -- Auto calculated: raw_weight_gram * total_production
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (daily_menu_id) REFERENCES daily_menus(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Table: portion_configs (Porsi Besar / Kecil Profiles)
CREATE TABLE IF NOT EXISTS portion_configs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    daily_energy DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    daily_protein DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    daily_fat DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    daily_carbs DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    adequacy_percent DECIMAL(5,2) NOT NULL DEFAULT 30.00,
    meal_energy DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    meal_protein DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    meal_fat DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    meal_carbs DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    multiplier DECIMAL(5,2) DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
