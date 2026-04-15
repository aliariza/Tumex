export function getMachineAttributes(selectedPrice) {
  let attributes = {
    'LAZER KAFASI': selectedPrice.laser_head,
    'LAZER KAYNAĞI': selectedPrice.laser_source,
    'X EKSENİ SERVO MOTOR': selectedPrice.x_axis_servo_motor,
    'Y EKSENİ SERVO MOTOR': selectedPrice.y_axis_servo_motor,
    'Z EKSENİ SERVO MOTOR': selectedPrice.z_axis_servo_motor,
    'ELEKTRİK AKSAMI': selectedPrice.electric_parts,
    'XYZ OTO MATİK YAĞLAMA': selectedPrice.xyz_auto_lubrication,
    'ÇALIŞMA ALANI': selectedPrice.working_area,
    'BOŞLUKTAKİ MAKS. HAREKET HIZI': selectedPrice.max_movement_idle,
    'KESME GAZI': selectedPrice.cutting_gas,
    'GAZ GİRİŞİ': selectedPrice.gas_input,
    'SANAYİ TİPİ UZAKTAN KUMANDA': selectedPrice.industrial_remote_control,
    'AKTİF ÇARPIŞMA ÖNLEME': selectedPrice.active_collision_prevention,
    'CÜRUF ÖNLEYİCİ KORUMA': selectedPrice.slag_protection,
    'HARİCİ DOKUNMATİK EKRAN': selectedPrice.external_touch_screen,
    'Wi-Fi INTERNET BAĞLANTISI': selectedPrice.wifi_internet,
    'ÇEVRİMİÇİ SERVİS': selectedPrice.online_service,
    'MAKS. HIZLANMA': selectedPrice.max_acceleration,
    'TABLA YÜKÜ': selectedPrice.table_load,
    'TAKIM TEZGAHI BOYUTLARI': selectedPrice.machine_dimensions,
    'TAKIM TEZGAHI AĞIRLIĞI': selectedPrice.machine_weight,
    'Z EKSENİ HAREKETİ': selectedPrice.z_axis_movement,
    GÖVDE: selectedPrice.body,

    'TABLA DEĞİŞTİRME': selectedPrice.table_exchange,
    'LİNEER RAYLAR': selectedPrice.linear_rails,
    'KREMAYER DİŞLİ': selectedPrice.kremayer_gear,
    'KONTROL SİSTEMİ': selectedPrice.control_system,
    'KAPALI KASA FAN ADEDİ': selectedPrice.no_fans_closed,
    'O₂ ORANSAL VANA': selectedPrice.o2_proportional_valve,
    'AZOT/HAVA ORANSAL VANA': selectedPrice.nitrogen_air_proportional_valve,
    KLİMA: selectedPrice.air_condition,
    'KAPI ADEDİ': selectedPrice.no_of_doors,
    'KAPI AÇIK KORUMASI': selectedPrice.door_open_protection,
    'OTOMATİK TEMİZLEME FIRÇASI': selectedPrice.auto_cleaning_brush,
    'HD KAMERA ADEDİ': selectedPrice.no_of_HD_camera,
    'SU SOĞUTUCUSU': selectedPrice.water_chiller,

    'TOPLAM GÜÇ': selectedPrice.total_power,
    'TAVSİYE EDİLEN KOMPRESÖR BASINCI': selectedPrice.recommended_compressor_pressure,
    'KOMPRESÖR TOPLAM GÜÇ': selectedPrice.compressor_total_power,
    'KAPALI KASA SAÇ KALINLIĞI': selectedPrice.thickness_of_encirclement,
    'EMİŞ FAN ADEDİ': selectedPrice.no_of_suction_fans
  }

  for (let key in attributes) {
    if (!attributes[key]) attributes[key] = 'N/A'
  }
  return attributes
}
