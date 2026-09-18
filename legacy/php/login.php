<?php
include("koneksi.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    // Query untuk mendapatkan data user berdasarkan email
    $sql = "SELECT * FROM user WHERE email='$email'";
    $result = $koneksi->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        // Verifikasi password
        if (password_verify($password, $row["password"])) {
            // Password benar, arahkan ke halaman selamat datang atau halaman lainnya
            header('Location: ../des1.html');
            exit;
        } else {
            echo "Password salah.";
        }
    } else {
        echo "Akun dengan email tersebut tidak ditemukan.";
    }
}

$koneksi->close();
?>
