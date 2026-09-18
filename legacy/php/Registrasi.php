<?php
include("koneksi.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Tangkap data dari formulir registrasi
    $first_name = $_POST["first_name"];
    $last_name = $_POST["last_name"];
    $email = $_POST["email"];
    $password = $_POST["password"];

    // Enkripsi password sebelum disimpan ke database (disarankan menggunakan metode keamanan yang lebih baik)
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Query untuk menyimpan data ke dalam tabel user
    $sql = "INSERT INTO user (first_name, last_name, email, password) VALUES ('$first_name', '$last_name', '$email', '$hashed_password')";

    if ($koneksi->query($sql) === TRUE) {
        header('Location: /Project/PABW/login.html');
        exit;
    } else {
        echo "Error: " . $sql . "<br>" . $koneksi->error;
    }
}

$koneksi->close();
?>
