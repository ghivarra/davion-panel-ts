<?php 

return [
    // Core Messages
    'noRuleSets'      => 'Belum ada aturan yang diterapkan pada konfigurasi validasi.',
    'ruleNotFound'    => '"{0}" bukan tipe aturan yang valid.',
    'groupNotFound'   => '"{0}" bukan tipe grup aturan.',
    'groupNotArray'   => '"{0}" grup aturan harus berbentuk array.',
    'invalidTemplate' => '"{0}" bukan template validasi yang valid.',

    // Rule Messages
    'alpha'                 => '<b>{field}</b> hanya bisa diisi dengan karakter alfabet.',
    'alpha_dash'            => '<b>{field}</b> hanya bisa diisi dengan karakter alfabet, nomor, underscore, dan strip.',
    'alpha_numeric'         => '<b>{field}</b> hanya bisa diisi dengan karakter alfabet dan nomor.',
    'alpha_numeric_punct'   => '<b>{field}</b> hanya bisa diisi dengan karakter alfabet, nomor, spasi, dan karakter-karakter ini: ~ ! # $ % & * - _ + = | : .',
    'alpha_numeric_space'   => '<b>{field}</b> hanya bisa diisi dengan karakter alfabet, nomor, dan spasi.',
    'alpha_space'           => '<b>{field}</b> hanya bisa diisi dengan alfabet dan spasi.',
    'decimal'               => '<b>{field}</b> hanya bisa diisi dengan angka desimal.',
    'differs'               => '<b>{field}</b> harus berbeda dengan <b>{param}</b>.',
    'equals'                => '<b>{field}</b> harus sama dengan form: <b>{param}</b>.',
    'exact_length'          => 'Jumlah karakter pada <b>{field}</b> harus berjumlah <b>{param}</b> karakter.',
    'field_exists'          => '<b>{field}</b> tidak ditemukan.',
    'greater_than'          => '<b>{field}</b> harus lebih besar dibanding <b>{param}</b>.',
    'greater_than_equal_to' => '<b>{field}</b> harus lebih besar atau sama dengan <b>{param}</b>.',
    'hex'                   => '<b>{field}</b> hanya bisa diisi dengan karakter heksadesimal.',
    'in_list'               => '<b>{field}</b> hanya bisa diisi dengan salah satu dari list ini: <b>{param}</b>.',
    'integer'               => '<b>{field}</b> harus diisi dengan integer.',
    'is_natural'            => '<b>{field}</b> hanya bisa diisi dengan bilangan positif dan nol.',
    'is_natural_no_zero'    => '<b>{field}</b> hanya bisa diisi dengan bilangan positif atau lebih besar dari nol.',
    'is_not_unique'         => 'Data <b>{field}</b> tidak ditemukan.',
    'is_unique'             => 'Data <b>{field}</b> sudah digunakan.',
    'less_than'             => '<b>{field}</b> hanya bisa diisi dengan angka yang lebih rendah dari <b>{param}</b>.',
    'less_than_equal_to'    => '<b>{field}</b> hanya bisa diisi dengan angka yang lebih rendah atau sama dengan <b>{param}</b>.',
    'matches'               => 'Data <b>{field}</b> tidak sesuai dengan <b>{param}</b>.',
    'max_length'            => 'Jumlah karakter pada <b>{field}</b> tidak boleh melebihi <b>{param}</b> karakter.',
    'min_length'            => 'Jumlah karakter pada <b>{field}</b> setidaknya harus lebih atau sama dengan <b>{param}</b> karakter.',
    'not_equals'            => '<b>{field}</b> tidak boleh sama dengan form: <b>{param}</b>.',
    'not_in_list'           => '<b>{field}</b> tidak boleh diisi dengan salah satu dari list ini: <b>{param}</b>.',
    'numeric'               => '<b>{field}</b> hanya bisa diisi dengan nomor.',
    'regex_match'           => 'Format <b>{field}</b> tidak sesuai.',
    'required'              => '<b>{field}</b> harus diisi.',
    'required_with'         => '<b>{field}</b> harus diisi bila <b>{param}</b> diisi.',
    'required_without'      => '<b>{field}</b> harus diisi bila <b>{param}</b> tidak diisi.',
    'string'                => '<b>{field}</b> hanya bisa diisi dengan string.',
    'timezone'              => '<b>{field}</b> hanya bisa diisi dengan Zona Waktu yang valid.',
    'valid_base64'          => '<b>{field}</b> hanya bisa diisi dengan data Base64.',
    'valid_email'           => '<b>{field}</b> harus diisi dengan format email yang tepat.',
    'valid_emails'          => 'Semua <b>{field}</b> harus diisi dengan format email yang tepat.',
    'valid_ip'              => '<b>{field}</b> harus diisi dengan format IP Address yang tepat.',
    'valid_url'             => '<b>{field}</b> harus diisi dengan format URL yang tepat.',
    'valid_url_strict'      => '<b>{field}</b> harus diisi dengan format URL yang tepat.',
    'valid_date'            => '<b>{field}</b> harus diisi dengan format tanggal yang tepat.',
    'valid_json'            => '<b>{field}</b> harus diisi dengan format JSON yang tepat.',

    // Credit Cards
    'valid_cc_num' => '<b>{field}</b> yang diisi bukan merupakan kartu kredit yang valid.',

    // Files
    'uploaded' => 'Proses upload <b>{field}</b> gagal/tidak valid.',
    'max_size' => 'File <b>{field}</b> terlalu besar.',
    'is_image' => 'File <b>{field}</b> harus berbentuk gambar.',
    'mime_in'  => 'Tipe file <b>{field}</b> tidak tepat.',
    'ext_in'   => 'Tipe ekstensi <b>{field}</b> tidak tepat.',
    'max_dims' => '<b>{field}</b> antara bukan sebuah gambar, atau gambarnya terlalu lebar/tinggi.',
];